from django.shortcuts import render
# Create your views here.

def view_listagem_dados(request):
    return render(request, 'core/template_listagem_dados.html')