# monitor/admin.py
from django.contrib import admin
from .models import SiteCheck, Site, ServiceNotification 

@admin.register(SiteCheck)
class SiteCheckAdmin(admin.ModelAdmin):
    list_display = ("service_name", "url", "status", "checked_at")
    list_filter = ("status",)
    search_fields = ("service_name", "url")

@admin.register(Site)
class SiteAdmin(admin.ModelAdmin):
    list_display = ("name", "url")

@admin.register(ServiceNotification)
class ServiceNotificationAdmin(admin.ModelAdmin):
    list_display = ("site", "status", "sent_at", "email_sent")


