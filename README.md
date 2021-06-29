# Réseau social interne Groupomania

Le projet a été généré avec Angular CLI version 12.0.1.
Version de node.js : 14.15.1
Base de données SQL

 ## Pré-requis
Cloner le projet, puis :
  
   # database:
   - créer une base de données SQL 
   
   - si vous avez `mySql WorKbench` allez dans `local instance` ouvrez le fichier `datebase_groupomania.sql` à l'interieur, et exécuter.
     toutes les tables seront automatiquement créées.
   - si vous n'avez pas `mySql Workbench` ouvrez un termial et taper `SOURCE leCheminVers/leFichierDatabase_groupomania`et exécutez le.
     toutes les tables seront automatiquement créées.
 

   - modifier les informations dans le fichier .env_prod et renommer le en .env
   
   - pour créé un admin le front et le back doivent etre lancer créé un compte utilisateur, un fois l'utilisateur créé connectez vous a mysql et entrer                   cette commande `UPDATE Users  set isAdmin = '1' where id = 'id de l'utilisateur a passer admin'`
   
   - lancer `npm install` et lancer le server avec la commande `nodemon`, les tables serons automatiquement générées par `Sequelize`.


   # backend
   
   - dans le dossier backend créé un dossier images (attention l'orthographe est importante) ou les fichiers multimedia serons stockés.
   
   - dans votre terminal ouvrer le dossier back et lancer la commande `npm install`


   # frontend
   
   - dans le dossier frontend 
   
   - si vous n'avez pas angular d'installer sur votre machine installez le avec `npm install -g @angular/cli`
   
   - lancer le serveur de developpement avec la commande `ng serve`
   
   - pour accéder au projet rendez-vous maintenant sur  http://localhost:4200/
