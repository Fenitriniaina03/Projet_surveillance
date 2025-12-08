from django.db import models

class SiteCheck(models.Model):
    service_name = models.CharField(max_length=255)
    url = models.CharField(max_length=500)
    status = models.CharField(max_length=50)
    response_time = models.FloatField(null=True, blank=True)
    checked_at = models.DateTimeField(auto_now_add=True)

    ssl_valid = models.BooleanField(default=True)
    content_length = models.IntegerField(null=True, blank=True)
    keyword_found = models.BooleanField(default=True)
    error_rate = models.FloatField(default=0.0)
    error_type = models.CharField(max_length=255, null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.url:
            self.url = self.url.rstrip("/")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.service_name} - {self.status}"


class Site(models.Model):
    name = models.CharField(max_length=255)
    url = models.URLField(unique=True)

    def __str__(self):
        return self.name


class ServiceNotification(models.Model):
    site = models.ForeignKey('SiteCheck', on_delete=models.CASCADE)
    status = models.CharField(max_length=50)
    sent_at = models.DateTimeField(auto_now_add=True)
    email_sent = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.site.service_name} - {self.status}"


