from django.core.mail import send_mail

def send_service_email(service, status):
    subject = f"Service {service.name} est {status}"
    
    if status == "DOWN":
        message = (
            f"Le service {service.name} ({service.url}) est EN PANNE.\n\n"
            f"Dernier check : {service.last_checked}\n"
            f"Description : Le service ne répond plus ou renvoie un code d'erreur."
        )
    else:
        message = (
            f"Le service {service.name} ({service.url}) est de nouveau UP ✅.\n"
            f"Dernier check : {service.last_checked}\n"
        )
    
    send_mail(
        subject,
        message,
        "monitoring@tonapp.com",   # sender
        ["ambinintsoafenitriniaina@gmail.com"],  # destinataire
        fail_silently=False,
    )
