from django.db import models

# Create your models here.

class saste(models.Model):

   username = models.CharField(max_length = 50)
   productname = models.CharField(max_length = 50)
   domain = models.CharField(max_length = 50)
   pid = models.CharField(max_length = 50)

   class Meta:
      db_table = "saste"


