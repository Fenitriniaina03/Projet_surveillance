# monitor/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import SiteCheck
from .serializers import SiteCheckSerializer
from django.db.models import Q
import urllib.parse

# ---------- services APIs ----------
@api_view(["GET"])
def latest_checks(request):
    checks = SiteCheck.objects.all().order_by("-checked_at")
    serializer = SiteCheckSerializer(checks, many=True)
    return Response(serializer.data)

@api_view(["GET"])
def history(request):
    checks = SiteCheck.objects.all().order_by("-checked_at")
    serializer = SiteCheckSerializer(checks, many=True)
    return Response(serializer.data)

@api_view(["GET"])
def service_details(request, encoded_url):
    decoded_url = urllib.parse.unquote(encoded_url)
    clean_url = decoded_url.rstrip("/")

    checks = SiteCheck.objects.filter(
        Q(url__iexact=clean_url) | Q(url__iexact=clean_url + "/")
    ).order_by("-checked_at")

    if not checks.exists():
        return Response({"error": "Service introuvable"}, status=404)

    latest = checks.first()
    latest_serializer = SiteCheckSerializer(latest)
    history_serializer = SiteCheckSerializer(checks, many=True)

    return Response({
        "service": latest_serializer.data,
        "history": history_serializer.data
    })


