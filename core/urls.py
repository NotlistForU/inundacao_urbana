
# listagem-dados/ → URL
# view_listagem_dados → função da view
# rota_listagem_dados → nome da rota
# template_listagem_dados.html → template


#core/urls.py -> se não era admin/ cai aqui
from django.urls import path
from . import views

urlpatterns = [
# if(url = listagem_dados/){
    # Quando acessar 'listagem_dados/', chama a função 'listagem_dados' da views.py
    path('listagem_dados/', views.view_listagem_dados, name='rota_listagem_dados')
#}
]