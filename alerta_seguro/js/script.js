// CHECKLIST: avalia os hábitos marcados pelo usuário.
const botaoAvaliar = document.getElementById("avaliarChecklist");
if (botaoAvaliar) {
    botaoAvaliar.addEventListener("click", function () {
        const itens = document.querySelectorAll(".item-seguranca");
        const resultado = document.getElementById("resultadoChecklist");
        let marcados = 0;
        itens.forEach(function (item) { if (item.checked) marcados++; });
        const porcentagem = Math.round((marcados / itens.length) * 100);
        let titulo, mensagem, classe;
        if (porcentagem >= 75) {
            titulo = "Seus hábitos são bastante seguros!";
            mensagem = "Muito bem! Você marcou várias atitudes importantes. Continue mantendo esses cuidados.";
            classe = "resultado-seguro";
        } else if (porcentagem >= 40) {
            titulo = "Sua segurança pode melhorar.";
            mensagem = "Você já pratica alguns cuidados, mas ainda há hábitos importantes para adotar. Leia as dicas do site.";
            classe = "resultado-atencao";
        } else {
            titulo = "Seus hábitos ainda não são suficientemente seguros.";
            mensagem = "Reforce seus cuidados: use senhas diferentes, ative a verificação em duas etapas e desconfie de links inesperados.";
            classe = "resultado-perigo";
        }
        resultado.className = "resultado " + classe;
        resultado.innerHTML = "<h2>" + titulo + "</h2><p>" + mensagem + "</p><p><b>Resultado: " + porcentagem + "% (" + marcados + " de " + itens.length + " atitudes marcadas).</b></p>";
    });
}

// VERIFICADOR DE LINKS: procura sinais básicos de risco.
const botaoVerificar = document.getElementById("verificarLinkBtn");
if (botaoVerificar) {
    const campoLink = document.getElementById("linkSuspeito");
    const resultadoLink = document.getElementById("resultadoLink");
    botaoVerificar.addEventListener("click", function () {
        let link = campoLink.value.trim();
        if (link === "") { mostrarResultado(resultadoLink, "resultado-atencao", "Digite um endereço", "Cole um link para iniciar a análise."); return; }
        if (!link.startsWith("http://") && !link.startsWith("https://")) link = "https://" + link;
        let endereco;
        try {
            endereco = new URL(link);
            if (!endereco.hostname.includes(".")) throw new Error("Endereço inválido");
        } catch (erro) {
            mostrarResultado(resultadoLink, "resultado-perigo", "Endereço inválido", "Confira se o endereço foi digitado corretamente."); return;
        }
        let sinais = [];
        const dominio = endereco.hostname.toLowerCase();
        const texto = (endereco.hostname + endereco.pathname + endereco.search).toLowerCase();
        if (endereco.protocol !== "https:") sinais.push("O endereço não utiliza HTTPS.");
        if (link.includes("@")) sinais.push("O endereço contém o caractere @.");
        if (link.length > 100) sinais.push("O endereço é muito longo.");
        if (/^(\d{1,3}\.){3}\d{1,3}$/.test(dominio)) sinais.push("O endereço utiliza um IP diretamente em vez de um domínio comum.");
        if (dominio.split(".").length >= 5) sinais.push("O domínio possui muitos níveis ou subdomínios.");
        const palavras = ["login", "senha", "pix", "premio", "prêmio", "urgente", "bloqueio", "bonus", "bônus", "validar"];
        let encontradas = [];
        palavras.forEach(function (palavra) { if (texto.includes(palavra) && !encontradas.includes(palavra)) encontradas.push(palavra); });
        if (encontradas.length > 0) sinais.push("Foram encontradas palavras que merecem atenção: " + encontradas.join(", ") + ".");
        if (dominio.includes("--")) sinais.push("O domínio possui hífens duplicados.");
        if (sinais.length >= 3) mostrarResultado(resultadoLink, "resultado-perigo", "Vários sinais de risco encontrados", "Evite abrir o endereço ou informar seus dados até confirmar a origem.", sinais);
        else if (sinais.length > 0) mostrarResultado(resultadoLink, "resultado-atencao", "Atenção: confira este link", "Encontramos sinais que merecem investigação. Isso não confirma que seja um golpe.", sinais);
        else mostrarResultado(resultadoLink, "resultado-seguro", "Nenhum sinal básico foi encontrado", "Isso não garante que o site seja confiável. Confirme o endereço por um canal oficial.");
    });
    document.getElementById("limparLinkBtn").addEventListener("click", function () { campoLink.value = ""; resultadoLink.className = "resultado"; resultadoLink.innerHTML = ""; campoLink.focus(); });
}


// Função comum para exibir resultados das ferramentas.
function mostrarResultado(elemento, classe, titulo, mensagem, lista) {
    elemento.className = "resultado " + classe;
    let html = "<h2>" + titulo + "</h2><p>" + mensagem + "</p>";
    if (lista && lista.length > 0) {
        html += "<b>Sinais encontrados:</b><ul>";
        lista.forEach(function (item) { html += "<li>" + escaparHTML(item) + "</li>"; });
        html += "</ul>";
    }
    elemento.innerHTML = html;
}
function escaparHTML(texto) {
    return texto.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
