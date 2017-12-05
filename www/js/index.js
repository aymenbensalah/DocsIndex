var indextion = function() {
  var stopList = [
    " à ",
    " au ",
    " d'",
    " de ",
    " du ",
    " des ",
    " elle ",
    " est ",
    " je ",
    " il ",
    " ils ",
    " le ",
    "le ",
    " la ",
    "la ",
    " les ",
    "les ",
    " lui ",
    " qui ",
    " son ",
    " sont ",
    " s'",
    " sa ",
    " ses ",
    " tu ",
    " dans ",
    " un ",
    " une ",
    "c'est",
    ",",
    ":",
    ";",
    "?",
    "!",
    "$",
    "*",
    '"',
    ">",
    "<",
    "(",
    ")",
    "[",
    "]",
    "@",
    "_",
    "+",
    "/",
    "  "
  ],
    docs = [
      "Les loups est dans les bergeries",
      "les filles jouent ensemble dans la maison",
      "Les moutons sont dans la bergerie",
      "Spider Cochon , Spider Cochon , il marcher au plafond"
    ];
  $("#docs").hide();
  $("#displayDocs").on("tap",function(event) {
    $("#docs").css("display", "visible");
    $("#docs").html("");
    for (var i = 0; i < docs.length; i++) {
      $("#docs").append("<p>"+"Document N° " + (i + 1) + ":" + docs[i]+"</p>"+"<br>");
    }
    if (!$("#docs").is(":visible")){
      $("#docs").stop().slideDown("slow");
    }
    if ($("#docs").is(":visible")){
      $("#docs").stop().slideUp("slow");
    }
  });
  //add Doc
$('#addDocInput').hide();
$('#addDocBtn').hide();
$("#addDoc").on("tap",function(event){
  $("#addDocInput").css("display","visible");
  $("#addDocBtn").css("display","visible");
  if (!$("#addDocInput").is(":visible")){
    $("#addDocInput").stop().slideDown("slow");
  }
  if (!$("#addDocBtn").is(":visible")){
    $("#addDocBtn").stop().slideDown("slow");
  }
  if($("#addDocInput").val() !="") {
    $("#addDocBtn").on("tap",function(event) {
      docs.push($("#addDocInput").val());
    }
    );
  }
}
);
  var wordFrequencyStr = function(word,string) {
    var wordsOfString = string.split(' '),
      frequency = 0;
    wordsOfString.forEach(function(wordTab,index){
      if(word === wordTab){
        frequency++;
      }
    });
    return frequency;
  }
  var removeRepetions = function(doc) {
    var subDocTab = doc.split(' ');
    for (i = 0 ; i < subDocTab.length/2 ; i++) {
      while (wordFrequencyStr(subDocTab[i].trim(),doc) > 1){
        doc = doc.replace(subDocTab[i].trim()," ");
      }
    }
    return doc.trim();
 }
  var removeStopList = function(document1) {
    document1 = document1.trim();
    document1 = removeRepetions(document1);
    stopList.forEach(function(value) {
      while(document1.indexOf(value) !== -1) {
        document1 = document1.toLowerCase().replace(value, " ");
      }
    });
    return document1.trim();
  };
  /**
   * Stemming Word.
   *
   * @param  {String} word
   * @param  {String} language
   * @return {String}
   * @author  Aymen Ben Salah
   */
  var stemmingWord = function(word, language) {
    var stemmer = new Snowball(language);
    stemmer.setCurrent(word);
    stemmer.stem();
    return stemmer.getCurrent();
  };
  /**
   * Stemming document.
   *
   * @param  {[type]} documents [description]
   * @return {[type]}           [description]
   */
  var stemmingDoc = function(documents) {
    var wordsDoc = documents.split(" ");

    return wordsDoc.map(function(wordDoc) {
      return stemmingWord(wordDoc, "french");
    });
  };
  //word frequency function

  var wordFrequency = function(word, table) {
    var frequency = 0, copyTable = table.slice(0);

    while (copyTable.indexOf(word) != -1) {
      frequency++;
      copyTable.splice(copyTable.indexOf(word), 1);
    }
    return frequency;
  };
  var documentIndexation = function(documents) {
    var docsStemming = {}, wordWithFrequency = {}, indexedDoc = {};
    documents.forEach(function(doc, index) {
      docsStemming[index] = stemmingDoc(removeStopList(doc));

      for (var j = 0; j < docsStemming[index].length; j++) {
        wordWithFrequency[docsStemming[index][j]] = wordFrequency(
          docsStemming[index][j],
          docsStemming[index]
        );
      }
      indexedDoc["Doc" + (index + 1) + " : "] = wordWithFrequency;
      wordWithFrequency = {};
    });
    return indexedDoc;
  };
  //affiche IndexedDocs
  $("#docsIndexed").hide();
  $("#displayIndexedDocs").on("tap",function(event) {
    $("#docsIndexed").html("");
    $("#docsIndexed").css("display", "visible");
    if (!$("#docsIndexed").is(":visible")){
      $("#docsIndexed").stop().slideDown("slow");
    }

    for (var doc in documentIndexation(docs)) {
      $("#docsIndexed").append("<p>" + doc);
      for (var wordd in documentIndexation(docs)[doc]) {
        $("#docsIndexed").append(
          " "+ wordd + "= " + documentIndexation(docs)[doc][wordd]
        );
      }
      $("#docsIndexed").append("</p>");
    }
  });
  // inverse
  var wichDocs = function(word,indexedDocs) {
     var docAndFrequency = "";
     for(doc in indexedDocs){
       if(Object.keys(indexedDocs[doc]).indexOf(word)!=-1){
           docAndFrequency+=" "+doc+" "+indexedDocs[doc][word];
           delete indexedDocs[doc][word];
      }
    }
    return docAndFrequency;
  }
  var inversedDocs = function(docs) {
    var indexedDocs = {},inverse ="";

    Object.assign(indexedDocs,documentIndexation(docs));
    for (var doc in indexedDocs) {
       for (var word in indexedDocs[doc] ) {
          inverse+="<br> "+word +" \<"+wichDocs(word,indexedDocs)+"\> ";
       }
    }

  return inverse;
  };

  $("#inversDocsDisplay").hide();
  $("#inversDocs").on("tap",function(event){
      var inversedoc = inversedDocs(docs);
       $("#inversDocsDisplay").html("");
       $("#inversDocsDisplay").css("display","visible");
       $("#inversDocsDisplay").append("\n"+inversedoc);
       if (! $("#inversDocsDisplay").is(":visible")){
          $("#inversDocsDisplay").stop().slideDown("slow");
       }
   });

}
$(document).ready(
  function(){
      indextion();
      console.log("documen load");
  }
);

document.addEventListener(
  "deviceready",
  indextion
);
