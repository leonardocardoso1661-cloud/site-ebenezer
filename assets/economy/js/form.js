// ====== CONFIGURAÇÃO DO ENVIO DOS FORMULÁRIOS (Web3Forms) ======
// 1) Crie sua chave em https://web3forms.com (digite o e-mail que vai RECEBER as mensagens).
// 2) A chave chega nesse e-mail. Cole ela abaixo, entre as aspas.
const WEB3FORMS_URL = 'https://api.web3forms.com/submit';
const WEB3FORMS_KEY = '617b7791-63b0-4fc6-ab6a-e2531ea75d2f';
const NOME_DO_SITE = 'Site Ebenézer';
const ASSUNTOS = {
    contato: 'Novo contato pelo site',
    newsletter: 'Nova inscrição - Fique por dentro',
    orcamento: 'Novo pedido de orçamento'
};
const MENSAGENS_OK = {
    contato: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
    newsletter: 'Inscrição realizada com sucesso!',
    orcamento: 'Pedido de orçamento enviado com sucesso! Entraremos em contato em breve.'
};
// ================================================================

$("input").prop('autocomplete', 'none');

$.fn.serializeObject = function() {
    let o = {};
    let a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

function makeid(length) {
    let result = '';
    let characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


function createCookie(name, value, days) {
    var expires;

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}


$(document).ready(function() {

    const currentPage = window.location.pathname;
    $('ul.navigation a').each(function() {
        if ($(this).attr('href') == currentPage) {
            $(this).closest('li').addClass('current active');
        }
    });

    var captcha = makeid(5);
    $('.captcha').text(captcha);

    $(document).on('submit', '.formSearch', function(e) {
        e.preventDefault();
        e.stopPropagation();
        // Busca feita no próprio navegador: leva para a lista de produtos com ?busca=termo
        let termo = $.trim($(this).find('input[name="search"]').val());
        window.location = '/produtos.html' + (termo ? '?busca=' + encodeURIComponent(termo) : '');
    });

    $(document).on('submit', '.formSubmit', function(e) {
        e.preventDefault();
        var validacao = true;
        let $thisform = $(this);
        let $result_field = $thisform.find('.captcha_result');
        if (captcha != $result_field.val()) {
            $result_field.addClass('input-error');
            validacao = false;
        }

        let $formResult = $thisform.find('.alert');


        $formResult.html('');
        $thisform.find('.alert-danger').removeClass('alert-danger');
        $thisform.find('.alert-success').removeClass('alert-success');

        let $redirect = false;
        if ($thisform.find("input[name='redirect']").length > 0) {
            $redirect = $thisform.find("input[name='redirect']");
        }

        let $method = $thisform.attr('method');
        let dadosForm = $thisform.serializeObject();

        if (validacao) {
            const tipo = $thisform.data('send');

            if (WEB3FORMS_KEY === 'COLE_SUA_CHAVE_AQUI') {
                $formResult.show(100).addClass('alert-danger').text('Formulário ainda não configurado: falta colocar a chave no arquivo form.js.');
                return;
            }

            const payload = Object.assign({}, dadosForm, {
                access_key: WEB3FORMS_KEY,
                subject: ASSUNTOS[tipo] || 'Nova mensagem do site',
                from_name: NOME_DO_SITE,
                name: dadosForm.nome || ''
            });

            $thisform.addClass('loading');
            fetch(WEB3FORMS_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(payload)
                }).then(response => response.json())
                .then((data) => {
                    $thisform.removeClass('loading');
                    if (data['success']) {
                        $thisform.trigger("reset");
                        $formResult.show(100).addClass('alert-success').text(MENSAGENS_OK[tipo] || 'Mensagem enviada com sucesso!');
                        captcha = makeid(5);
                        $('.captcha').text(captcha);
                        $thisform.find('.hidden-captcha').hide(100);
                    } else {
                        captcha = makeid(5);
                        $('.captcha').text(captcha);
                        $formResult.show(100).addClass('alert-danger').text('Não foi possível enviar. Confira os campos e tente novamente.');
                    }
                })
                .catch(() => {
                    $thisform.removeClass('loading');
                    captcha = makeid(5);
                    $('.captcha').text(captcha);
                    $formResult.show(100).addClass('alert-danger').text('Erro de conexão. Tente novamente em instantes.');
                });
        } else {
            captcha = makeid(5);
            $('.captcha').text(captcha);
            $formResult.show(100).addClass('alert-danger').text('Algo deu errado. Confira os campos e tente novamente!');
        }
    });

    $(document).on('input', '.formSubmit .campo-form', function() {
        $(this).closest('form').find('.alert').prop('class', 'alert').hide(100);
        if ($(this).val()) {
            $(this).closest('form').find('.hidden-captcha').show(100);
        }
    });

    $(document).on('click', '.btn-whatsapp', function() {
        // Número do WhatsApp (DDD + número, sem o 55). Edite aqui se precisar trocar.
        const numeroWhats = '51999483185';
        const mensagem = 'Olá! Encontrei a empresa Ebenézer através do site oficial e gostaria de conversar sobre um possível projeto.';
        window.open('https://wa.me/55' + numeroWhats + '?text=' + encodeURIComponent(mensagem), '_blank');
    });

    $(document).on('click', '.btn-cookies', function() {
        createCookie('aceito_cookies', 'aceito', 365);
        $(this).closest('.politica_cookies').fadeOut(200);
    });

    $('[data-bg-img]').each(function() {
        $(this).css('background-image', 'url(' + $(this).data("bg-img") + ')');
    });

    $(document).on('click', '.product-image .zoom-gallery figure', function() {
        let img = $(this).find('img').attr('src');
        let titulo = $(this).find('img').attr('alt');
        let conteudo = $('#galeria-ampliada').html().replace('{{url}}', img);
        conteudo = conteudo.replace('{{texto}}', titulo);
        $('.ampliado').html(conteudo).fadeIn(200);
    });
    $(document).on('click', '.zoom-gallery', function() {
        let img = $(this).find('img').attr('src');
        $('.product-image').find('img').attr('src', img);
    });

    $(document).on('click', '[type="close"]', function(e) {
        e.preventDefault();
        e.stopPropagation();
        let contetn = $(this).closest('.ampliado');
        contetn.fadeOut(300);
        setTimeout(() => {
            contetn.html('');
        }, 400);
    });

    $(document).on('click', '.btn-fechar-boas-vindas', function() {
        $(this).closest('#modal-boas-vindas').fadeOut(500).delay(500).remove();
        createCookie('modal', 'fechado', 1);
    });

    $(document).on('click', '.ct_galeria', function(e) {
        let filter = $(this).data('filter');
        $('.ct_galeria.active').removeClass('active');
        $(this).addClass('active');
        $('.galeria').find('figure').fadeOut(200);
        if (filter != 'all') {
            $('.galeria').find('figure' + filter).delay(200).fadeIn(200);
        } else {
            $('.galeria').find('figure').delay(200).fadeIn(200);
        }

    });

    if ($('#modal-boas-vindas').length > 0) {
        setTimeout(() => {
            $('#modal-boas-vindas').fadeIn(500);
        }, 3000);
    }

});


// ====== BUSCA DE PRODUTOS (funciona direto no navegador, sem servidor) ======
function normalizaTexto(t) {
    return (t || '').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();
}

$(function() {
    let $lista = $('section.team-section .col-md-9 article.team-member');
    if ($lista.length === 0) return;

    let termo = $.trim(new URLSearchParams(window.location.search).get('busca') || '');
    if (!termo) return;

    $('.formSearch input[name="search"]').val(termo);
    let palavras = normalizaTexto(termo).split(' ');
    let achados = 0;

    $lista.each(function() {
        let texto = normalizaTexto($(this).find('h3').text() + ' ' + $(this).find('.text').text());
        let ok = palavras.every(function(p) { return texto.indexOf(p) !== -1; });
        $(this).toggle(ok);
        if (ok) achados++;
    });

    let mensagem = achados > 0 ?
        achados + (achados === 1 ? ' produto encontrado' : ' produtos encontrados') + ' para “' :
        'Nenhum produto encontrado para “';
    let $aviso = $('<div class="col-xs-12 resultado-busca" style="margin-bottom:25px;font-size:17px;"></div>');
    $aviso.append(document.createTextNode(mensagem + termo + '”. '));
    $aviso.append($('<a href="/produtos.html" style="font-weight:700;text-decoration:underline;"></a>').text('Ver todos os produtos'));
    $lista.first().parent().prepend($aviso);
});
