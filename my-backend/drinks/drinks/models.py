from django.db import models

class Drink(models.Model):
    name = models.CharField(max_length = 200)
    description = models.CharField(max_length = 500)
    price = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.name + ' ' + self.description + ' ' + str(self.price)