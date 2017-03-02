<?php
 
   $dir = urldecode($_SERVER["DOCUMENT_ROOT"].$_SERVER["REQUEST_URI"]);
   
   $dir = preg_replace("/(\?.+)/","",$dir);
   
   echo "<h2>".urldecode($_SERVER["REQUEST_URI"])."</h2>";

   chdir($dir);

   $files = glob("*.mp3");
   preg_grep("/\.mp3$/i", $files);
   
   // no mp3s here? quit
   if (sizeof($files)==0) die();

   // otherwise continue w the page!
?>

<link rel="stylesheet" type="text/css" href="/jmplayer/jmplayer.css" />

<script type="text/javascript">
   var files = <?php echo json_encode($files)."\n"; ?>
   var getParams = <?php echo json_encode($_GET)."\n"; ?>
   
</script>
<script type="text/javascript" src="/jmplayer/jquery-3.1.1.min.js"></script>
<script type="text/javascript" src="/jmplayer/jmplayer.js"></script>


<?php
    if (isset($_GET["download"])==TRUE) {
       $downloadFileName = time(true).".zip";
       shell_exec("zip -0 /tmp/$downloadFileName *");
       rename("/tmp/$downloadFileName", "/var/www/html/download/$downloadFileName");
       ?>
       <script type="text/javascript">
          //console.log("<?php echo $_SERVER["REQUEST_URI"] ?>");
          window.open(window.location.origin +  "/download/<?php echo $downloadFileName ?>");
       </script>       
       
       <?php
    }
?>