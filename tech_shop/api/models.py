from django.db import models
from django.contrib.auth.models import User

class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places= 2)
    quantity = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='products_images/', blank=True, null=True )

    def __str__(self):
        return self.name
    
    class Meta: 
        ordering = ['id']

class Cart(models.Model):
    user = models.OneToOneField(User, on_delete= models.CASCADE)
    items = models.JSONField(default=list)

    def __str__(self):
        return f"{self.user.username}'s cart"
# Create your models here.
