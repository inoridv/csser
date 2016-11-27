function getMatches(string, regex, index) {  //função para pegar todos os matches na string
  index || (index = 1); // primeiro grupo de captura caso não setado
  var matches = [];
  var match;
  while (match = regex.exec(string)) {
    matches.push(match[index]);
  }
  return matches;
};

var openFile = function(event) {
  var input = event.target;
  var regcl = /class="([^"<?]+)"/g; // var de regex p/ classes          g opcional pelo meu approach
  var regid = /id="([^"<?]+)"/g; // var de regex p/ ids         g opcional pelo meu approach
  var classes = new Array();  //arrays para guardar.
  var ids = new Array();
  var reader = new FileReader();
  var aux;
  reader.onload = function(){
    var text = reader.result;
    classes = getMatches(text,regcl);
    ids = getMatches(text,regid);

    for(var k=0;k<classes.length;k++){
      if(classes[k].indexOf(' ') != -1) {      //verificação para quebrar a string em casos de multiplas classes na mesma linha
        aux = classes[k].split(" ");
        classes.splice(k,1);
        for(var j=0;j<aux.length;j++) {
          classes.push(aux[j]);
        };
      };
    };
    for(var k=0;k<ids.length;k++){
      if(ids[k].indexOf(' ') != -1) {      //verificação para quebrar a string em casos de multiplos ids na mesma linha
        aux = ids[k].split(" ");
        ids.splice(k,1);
        for(var j=0;j<aux.length;j++) {
          ids.push(aux[j]);
        };
      };
    };

    //remoção de itens repetidos com jQuery
    var uniqueClasses = [];
    $.each(classes, function(i, el){
      if($.inArray(el, uniqueClasses) === -1) uniqueClasses.push(el);
    });
    var uniqueIds = [];
    $.each(ids, function(i, el){
      if($.inArray(el, uniqueIds) === -1) uniqueIds.push(el);
    });

    //montando o arquivo na variável output
    var output = "";
    output = "/* Classes */\n\n"
    for(i=0;i<uniqueClasses.length;i++){
      output = output + "." + uniqueClasses[i] + " {  }\n\n";
    }
    output = output + "/* Ids */\n\n";
    for(i=0;i<uniqueIds.length;i++){
      output = output + "#" + uniqueIds[i] + " {  }\n\n";
    }

    //criando o arquivo em si para download
    var blob = new Blob([output], {type: 'text/css;charset=utf-8'});
    var name;
    if (document.getElementById('text-filename').value == "") {  //checagem para o nome do arquivo caso não fornecido, padrão = filename.txt
      name = "filename";
    } else {
      name = document.getElementById('text-filename').value;
    };
    saveAs(blob, name);
  };

  reader.readAsText(input.files[0]);

};
