from django.core.management.base import BaseCommand

from core.models import InundacaoUrbana


class Command(BaseCommand):
    help = "Copia os dados do banco de produção para o banco de teste"

    def handle(self, *args, **kwargs):
        registros = InundacaoUrbana.objects.using("default").all()

        for r in registros:
            InundacaoUrbana.objects.using("teste").create(
                id=r.id,
                cd_geocodi=r.cd_geocodi,
                municipio=r.municipio,
                cd_estacao=r.cd_estacao,
                longitude=r.longitude,
                latitude=r.latitude,
                cota_rn_ana=r.cota_rn_ana,
                cota_rn_orto=r.cota_rn_orto,
                cota_atencao=r.cota_atencao,
                cota_alerta=r.cota_alerta,
                cota_inundacao=r.cota_inundacao,
                cota_maxima=r.cota_maxima,
                data_voo=r.data_voo,
                status=r.status,
                integrado=r.integrado,
                cidade_id=r.cidade_id,
            )

        self.stdout.write(
            self.style.SUCCESS(f"{registros.count()} registros copiados com sucesso!")
        )