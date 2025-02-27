from django.core.mail import send_mail
from django.db.models import QuerySet

from analytics_project import settings
from dataprocessing.models import User
from workprogramsapp.notifications.emails.models import SentMail


def mail_sender(topic: str, text: str, emails: list, users: QuerySet) -> SentMail:
    send_mail(
        topic,
        text,
        settings.DEFAULT_FROM_EMAIL,
        emails,
        fail_silently=True,
    )
    mail = SentMail.objects.create(topic=topic, text=text)
    mail.users.add(*users)

    return mail
