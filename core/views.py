from django.shortcuts import render
from core.models import InundacaoUrbana
from django.forms.models import model_to_dict
import json
# Create your views here.
def view_login(request):
    return render(request, 'core/template_login.html')

def view_historico_alteracoes(request):
    return render(request, 'core/template_historico_alteracoes.html')

def view_listagem_dados(request):    
    dados = InundacaoUrbana.objects.all()
    dados_json = [
        model_to_dict(item)
        for item in dados
    ]

    num_dados = len(dados)
    num_estacoes = sum(1 for item in dados if item.cd_estacao)
    num_municipios = len(set(item.municipio for item in dados))

    num_integrado = sum(1 for item in dados if item.integrado)
    num_cota_atencao = sum(1 for item in dados if item.cota_atencao)
    num_cota_alerta = sum(1 for item in dados if item.cota_alerta)
    num_cota_inundacao = sum(1 for item in dados if item.cota_inundacao)

    if num_dados > 0 :
        por_cent_integrado = (num_integrado * 100) / num_dados
    else:
        por_cent_integrado = 0.0


    return render(request, 
                  'core/template_listagem_dados.html',
                  {
                    'dados': dados,
                    'dados_json': dados_json,
                    'num_dados': num_dados, 
                    'num_municipios': num_municipios,
                    'num_estacoes': num_estacoes,
                    'num_integrado': num_integrado,
                    'num_cota_atencao': num_cota_atencao,
                    'num_cota_alerta': num_cota_alerta,
                    'num_cota_inundacao': num_cota_inundacao,
                    'por_cent_integrado': por_cent_integrado
                  }
                )