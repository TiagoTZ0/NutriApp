from rest_framework import serializers
from .models import User, Organization, ProfessionalProfile, PatientProfile

# Organization serializer with subscription and plan features
class OrganizationSerializer(serializers.ModelSerializer):
    # Subscription status indicator
    status_subscription = serializers.BooleanField(source='has_active_subscription', read_only=True)
    
    class Meta:
        model = Organization
        fields = [
            'id', 
            'name', 
            'slug', 
            'plan_type', 
            'logo_url',
            'is_active',
            'subscription_end',
            
            # 👇 AQUI LA MAGIA: Exponemos las reglas de negocio al Frontend
            'max_patients', 
            'allows_branding', 
            'allows_marketplace',
            'allows_shopping_list',
            'support_level',
            'status_subscription'
        ]

# Professional profile serializer
class ProfessionalProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfessionalProfile
        fields = ['license_number', 'bio', 'specialties', 'city', 'rating', 'phone']

# Patient profile serializer
class PatientProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientProfile
        fields = ['date_of_birth', 'gender', 'height', 'weight', 'allergies', 'medical_conditions']

# Main user serializer
class UserSerializer(serializers.ModelSerializer):
    # Nested serialization for related objects
    organization_data = OrganizationSerializer(source='organization', read_only=True)
    professional_profile = ProfessionalProfileSerializer(read_only=True)
    patient_profile = PatientProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 
            'email', 
            'first_name', 
            'last_name', 
            'role', 
            'photo',
            'is_active',
            'organization',
            'organization_data',
            'professional_profile', 
            'patient_profile'
        ]
        read_only_fields = ['id', 'email', 'role', 'organization_data']