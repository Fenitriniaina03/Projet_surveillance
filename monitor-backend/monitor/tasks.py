# monitor/tasks.py
from celery import shared_task
import requests
from django.core.mail import send_mail
from django.utils import timezone
from django.conf import settings
from .models import SiteCheck
import subprocess
import shlex
import re

# ---------------------------
# Configuration services
# ---------------------------
SERVICES = [
    {"name": "SIRHI Web", "url": "https://sirhi.agileinterim.mg"},
    {"name": "SIRHI Backend", "url": "https://back-sirhi.agileinterim.mg/admin"},  # <-- URL corrigée
    {"name": "AgileConseils", "url": "https://agileconseils.com"},
    {"name": "Argos Recrutement", "url": "https://argos.agileinterim.mg/recrutement/"},
    {"name": "Smart Agile", "url": "https://smart.agileconseils.com"},
]

ALERT_EMAILS = ["ambinintsoafenitriniaina@gmail.com"]

# ---------------------------
# Fonctions d'alerte email
# ---------------------------
def send_alert_email(subject, message):
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        ALERT_EMAILS,
        fail_silently=False,
    )

def send_service_alert(service_name, status_clean, url):
    subject = f"[ALERTE SERVICE] {service_name} est {status_clean}"
    message = (
        f"Service : {service_name}\n"
        f"URL : {url}\n"
        f"Statut : {status_clean}\n"
        f"Vérifié le : {timezone.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
    )
    send_alert_email(subject, message)

def send_connection_alert(provider, ip, status_clean):
    subject = f"[ALERTE CONNEXION] {provider} ({ip}) est {status_clean}"
    message = (
        f"Connexion : {provider}\n"
        f"IP : {ip}\n"
        f"Statut : {status_clean}\n"
        f"Vérifié le : {timezone.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
    )
    send_alert_email(subject, message)

# ---------------------------
# Normalisation
# ---------------------------
def normalize(url):
    return url.rstrip("/") if url else url

def normalize_status(status):
    if not status:
        return "UNKNOWN"
    s = str(status).upper()
    if s.startswith("DOWN"):
        return "DOWN"
    if s.startswith("HTTP"):
        return s
    if s == "UP":
        return "UP"
    return "UNKNOWN"

# ---------------------------
# Vérification des services
# ---------------------------
@shared_task
def check_services():
    print("---- CHECK SERVICES START ----")
    for service in SERVICES:
        name = service["name"]
        url = normalize(service["url"])
        error_type = None

        last_check = SiteCheck.objects.filter(url=url).order_by("-checked_at").first()
        last_status_raw = last_check.status if last_check else None
        last_status = normalize_status(last_status_raw) if last_status_raw else None

        try:
            response = requests.get(url, timeout=20)
            status_raw = "UP" if response.status_code == 200 else f"HTTP {response.status_code}"
            response_time = response.elapsed.total_seconds()
            content_length = len(response.content)

            try:
                requests.get(url, verify=True, timeout=5)
                ssl_valid = True
            except:
                ssl_valid = False

            required_keyword = "html"
            keyword_found = required_keyword.lower() in response.text.lower()

        except requests.exceptions.Timeout:
            status_raw = "DOWN"
            response_time = None
            content_length = None
            ssl_valid = False
            keyword_found = False
            error_type = "Timeout"

        except requests.exceptions.ConnectionError:
            status_raw = "DOWN"
            response_time = None
            content_length = None
            ssl_valid = False
            keyword_found = False
            error_type = "Connection Refused"

        except requests.exceptions.RequestException:
            status_raw = "DOWN"
            response_time = None
            content_length = None
            ssl_valid = False
            keyword_found = False
            error_type = "Other Error"

        status_clean = normalize_status(status_raw)

        # Calcul du taux d'erreur sur les 3 derniers checks
        last_3 = SiteCheck.objects.filter(url=url).order_by("-checked_at")[:3]
        failures = sum(1 for c in last_3 if normalize_status(c.status) == "DOWN")
        error_rate = (failures / 3) * 100 if last_3 else 0

        # Création de la vérification
        SiteCheck.objects.create(
            service_name=name,
            url=url,
            status=status_raw,
            response_time=response_time,
            ssl_valid=ssl_valid,
            content_length=content_length,
            keyword_found=keyword_found,
            error_type=error_type,
            error_rate=error_rate,
            checked_at=timezone.now(),
        )

        # Alertes uniquement si changement de statut
        if (last_status is None or last_status == "UP") and status_clean == "DOWN":
            send_service_alert(name, "DOWN", url)
        if last_status == "DOWN" and status_clean == "UP":
            send_service_alert(name, "UP", url)

    print("---- CHECK SERVICES END ----")
    return "done"
