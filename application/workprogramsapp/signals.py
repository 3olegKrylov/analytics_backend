from django.contrib.auth.models import Group
from django.db.models.signals import post_save
from django.dispatch import receiver

from dataprocessing.models import User
from workprogramsapp.expertise.models import UserExpertise, Expertise
from workprogramsapp.models import WorkProgram
from workprogramsapp.notifications.models import ExpertiseNotification


def populate_models(sender, **kwargs):
    list_of_groups = ["rpd_developer", "education_plan_developer", "op_leader", "roles_and_professions_master",
                      "student", "expertise_master", "academic_plan_developer"]
    for group in list_of_groups:
        Group.objects.get_or_create(name=group)


@receiver(post_save, sender=UserExpertise)
def create_profile(sender, instance, created, **kwargs):
    """Create a matching profile whenever a user object is created."""
    if created:
        wp_exp = WorkProgram.objects.get(expertise_with_rpd=instance.expertise)
        ExpertiseNotification.objects.create(expertise=instance.expertise, user=instance.expert,
                                             message=f'Вы добавлены в экспертизу для рабочей программы "{wp_exp.title}"')


@receiver(post_save, sender=Expertise)
def post_save(sender, instance, created, **kwargs):
    """Create a matching profile whenever a user object is created."""
    wp_exp = WorkProgram.objects.get(expertise_with_rpd=instance)
    struct_users = User.objects.filter(user_for_structural_unit__status__in=["leader", "deputy"],
                                       user_for_structural_unit__structural_unit__workprogram_in_structural_unit__expertise_with_rpd=instance).distinct()
    for user in struct_users:
        ExpertiseNotification.objects.create(expertise=instance, user=user,
                                             message=f'Экспертиза для рабочей программы "{wp_exp.title}" поменяла свой статус на "{instance.get_expertise_status_display()}"')
