from django.db import models

# Create your models here.
class InundacaoUrbana(models.Model):
    id = models.IntegerField(primary_key=True);
    cd_geocodi = models.CharField(max_length=15, null=True, blank=True);
    municipio = models.CharField(max_length=80, null=True, blank=True);
    cd_estacao = models.IntegerField(null=True, blank=True);
    longitude = models.DecimalField(
        max_digits=12,
        decimal_places=9,
        null=True,
        blank=True
    );

    latitude = models.DecimalField(
        max_digits=12,
        decimal_places=8,
        null=True,
        blank=True
    )

    cota_rn_ana = models.IntegerField(null=True, blank=True);
    cota_rn_orto = models.IntegerField(null=True, blank=True);

    cota_atencao = models.FloatField(null=True, blank=True);
    cota_alerta = models.FloatField(null=True, blank=True);
    cota_inundacao = models.FloatField(null=True, blank=True);
    cota_maxima = models.FloatField(null=True, blank=True);

    data_voo = models.DateField(null=True, blank=True);

    status = models.BooleanField(null=True, blank=True);
    integrado = models.BooleanField(null=True, blank=True);
    cidade_id = models.BigIntegerField(null=True, blank=True);

    class Meta:
        db_table = '"sipam"."sipam_inundacao_urbana"'
        managed = False ######

    @property
    def data_voo_formatada(self):
        return self.data_voo.strftime('%d/%m/%Y') if self.data_voo is not None else None

    @property
    def cota_atencao_formatada(self):
        return f"{self.cota_atencao} m" if self.cota_atencao is not None else None
    
    @property
    def cota_alerta_formatada(self):
        return f"{self.cota_alerta} m" if self.cota_alerta is not None else None
    
    @property
    def cota_inundacao_formatada(self):
        return f"{self.cota_inundacao} m" if self.cota_inundacao is not None else None
