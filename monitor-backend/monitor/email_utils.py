# monitor/email_utils.py
from django.core.mail import EmailMessage
from django.conf import settings

# Un identifiant de thread par service (tu peux en ajouter d'autres)
SERVICE_THREADS = {
    "Argos Recrutement": "<monitor-argos-thread@sirhi-monitor>",
    "SIRHI Web": "<monitor-sirhiweb-thread@sirhi-monitor>",
    "SIRHI Backend": "<monitor-sirhiback-thread@sirhi-monitor>",
    "AgileConseils": "<monitor-agile-thread@sirhi-monitor>",
}

ALERT_EMAILS = ["agile@agileconseils.com", "ambinintsoafenitriniaina@gmail.com"]  # à adapter


def send_threaded_email(service_name: str, body: str):
    """
    Envoie un email qui sera regroupé dans UN SEUL fil Gmail par service.
    - Sujet FIXE par service
    - Headers In-Reply-To / References identiques → même conversation
    """
    # Sujet FIXE (IMPORTANT pour Gmail)
    subject = f"[MONITOR] {service_name}"

    # ID de thread racine pour ce service
    root_thread_id = SERVICE_THREADS.get(
        service_name,
        "<monitor-default-thread@sirhi-monitor>",
    )

    email = EmailMessage(
        subject=subject,
        body=body,
        from_email=getattr(settings, "DEFAULT_FROM_EMAIL", None),
        to=ALERT_EMAILS,
        headers={
            "In-Reply-To": root_thread_id,
            "References": root_thread_id,
        },
    )
    email.send(fail_silently=True)
