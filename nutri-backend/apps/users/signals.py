from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, ProfessionalProfile, PatientProfile

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Automatización: Crea el perfil vacío correspondiente apenas se registra el usuario.
    """
    if created:
        # Rol Profesional o Dueño -> Perfil Profesional
        if instance.role in ['PROFESSIONAL', 'ORG_OWNER', 'NUTRICIONISTA']:
            ProfessionalProfile.objects.create(user=instance)
            print(f"Professional profile created for {instance.email}")
            
        # Rol Paciente -> Perfil Médico
        elif instance.role in ['PATIENT', 'PACIENTE']:
            PatientProfile.objects.create(user=instance)
            print(f"Patient profile created for {instance.email}")

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """
    Guarda los datos anidados si se actualiza el usuario padre.
    """
    # Clean up related profile when user is deleted
    if instance.role in ['PROFESSIONAL', 'ORG_OWNER', 'NUTRICIONISTA']:
        try:
            instance.professional_profile.save()
        except ProfessionalProfile.DoesNotExist:
            ProfessionalProfile.objects.create(user=instance)
            
    elif instance.role in ['PATIENT', 'PACIENTE']:
        try:
            instance.patient_profile.save()
        except PatientProfile.DoesNotExist:
            PatientProfile.objects.create(user=instance)