from .utils import send_service_email

def check_service(service):
    old_status = service.status
    response, time = ping_service(service.url)

    if response:
        service.status = "UP"
        service.response_time = time
    else:
        service.status = "DOWN"
        service.response_time = None

    service.save()

    # Si changement de status → NOTIFIER
    if old_status != service.status:
        send_service_email(service, service.status)
