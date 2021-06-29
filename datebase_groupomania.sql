-- MySQL dump 10.13  Distrib 8.0.22, for macos10.15 (x86_64)
--
-- Host: localhost    Database: database_development_groupomania
-- ------------------------------------------------------
-- Server version	5.7.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Comments`
--

DROP TABLE IF EXISTS `Comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `messageId` int(11) DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  `attachment` varchar(255) DEFAULT NULL,
  `movie` varchar(255) DEFAULT NULL,
  `likes` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `messageId` (`messageId`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`messageId`) REFERENCES `Messages` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Comments`
--

LOCK TABLES `Comments` WRITE;
/*!40000 ALTER TABLE `Comments` DISABLE KEYS */;
INSERT INTO `Comments` VALUES (68,173,'pas de soucis pour moi je serais la ',NULL,NULL,1,'2021-06-29 08:44:32','2021-06-29 08:45:42',29),(71,173,'ok pour moi aussi ',NULL,NULL,0,'2021-06-29 08:47:57','2021-06-29 08:47:57',30),(72,173,'moi je pourrais pas être la désolé deja un truc de prévu ce soir',NULL,NULL,0,'2021-06-29 08:49:26','2021-06-29 08:49:26',31),(73,173,'je serais la aussi ',NULL,NULL,0,'2021-06-29 08:52:00','2021-06-29 08:52:00',32);
/*!40000 ALTER TABLE `Comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LikeComments`
--

DROP TABLE IF EXISTS `LikeComments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `LikeComments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `commentId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `isLike` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `messageId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `commentId` (`commentId`),
  KEY `userId` (`userId`),
  CONSTRAINT `likecomments_ibfk_1` FOREIGN KEY (`commentId`) REFERENCES `Comments` (`id`),
  CONSTRAINT `likecomments_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LikeComments`
--

LOCK TABLES `LikeComments` WRITE;
/*!40000 ALTER TABLE `LikeComments` DISABLE KEYS */;
INSERT INTO `LikeComments` VALUES (12,68,30,1,'2021-06-29 08:45:42','2021-06-29 08:45:42',NULL);
/*!40000 ALTER TABLE `LikeComments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Likes`
--

DROP TABLE IF EXISTS `Likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Likes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `messageId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `isLike` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `messageId` (`messageId`),
  KEY `userId` (`userId`),
  CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`messageId`) REFERENCES `Messages` (`id`),
  CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Likes`
--

LOCK TABLES `Likes` WRITE;
/*!40000 ALTER TABLE `Likes` DISABLE KEYS */;
INSERT INTO `Likes` VALUES (42,173,30,1,'2021-06-29 08:45:38','2021-06-29 08:45:38'),(43,173,31,1,'2021-06-29 08:49:35','2021-06-29 08:49:35'),(52,175,31,1,'2021-06-29 08:50:46','2021-06-29 08:50:46'),(53,175,32,1,'2021-06-29 08:51:38','2021-06-29 08:51:38'),(54,173,32,1,'2021-06-29 08:51:42','2021-06-29 08:51:42'),(55,173,29,1,'2021-06-29 08:55:45','2021-06-29 08:55:45'),(56,176,29,1,'2021-06-29 08:55:51','2021-06-29 08:55:51'),(57,175,29,1,'2021-06-29 08:55:53','2021-06-29 08:55:53');
/*!40000 ALTER TABLE `Likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Messages`
--

DROP TABLE IF EXISTS `Messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `content` varchar(255) DEFAULT NULL,
  `attachment` varchar(255) DEFAULT NULL,
  `movie` varchar(255) DEFAULT NULL,
  `likes` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=177 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Messages`
--

LOCK TABLES `Messages` WRITE;
/*!40000 ALTER TABLE `Messages` DISABLE KEYS */;
INSERT INTO `Messages` VALUES (173,28,'un apéro ce soir après le boulo ca vous dis ?',NULL,NULL,4,'2021-06-29 08:43:52','2021-06-29 08:55:45'),(175,31,'c\'est bientot le weekend',NULL,NULL,2,'2021-06-29 08:50:38','2021-06-29 08:55:53'),(176,32,'je suis la nouvelle admin je vous surveille ^^','http://localhost:8080/images/tenor.gif1624956754366.gif',NULL,1,'2021-06-29 08:52:34','2021-06-29 08:55:51');
/*!40000 ALTER TABLE `Messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SequelizeMeta`
--

DROP TABLE IF EXISTS `SequelizeMeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SequelizeMeta`
--

LOCK TABLES `SequelizeMeta` WRITE;
/*!40000 ALTER TABLE `SequelizeMeta` DISABLE KEYS */;
INSERT INTO `SequelizeMeta` VALUES ('20210403151543-create-user.js'),('20210403151721-create-message.js'),('20210405130838-create-like.js'),('20210406083516-create-like.js'),('20210406115414-create-like.js'),('20210520153749-create-comment.js'),('20210521070547-create-comment.js'),('20210521071330-create-comment.js'),('20210521071810-create-comment.js'),('20210531131158-create-like-comment.js'),('20210531151912-create-like-comment.js'),('20210601065211-create-like-comment.js'),('20210602121504-create-messages.js'),('20210602121724-create-comments.js'),('20210602122049-create-likes.js'),('20210602122134-create-like-comments.js'),('20210602122431-create-chat.js'),('20210602140345-create-user.js'),('20210602140540-create-messages.js'),('20210602140621-create-comments.js'),('20210602140759-create-likes.js'),('20210602140818-create-like-comments.js'),('20210602140827-create-chat.js'),('20210621070236-create-room-chat.js'),('20210621070504-create-chat-messages.js');
/*!40000 ALTER TABLE `SequelizeMeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `datebirth` varchar(255) DEFAULT NULL,
  `picture` varchar(255) DEFAULT NULL,
  `isAdmin` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `ChatId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (28,'deziel','Carole','$2b$10$ZcYxtXRH/pfsDNHKu8AVgOipX7BoYoHKSeYERg.M/MuSVx5tV6QTe','carole.deziel@groupomania.com','1997-07-23','http://localhost:8080/images/téléchargement.jpeg1624956856459.jpg',0,'2021-06-29 08:41:11','2021-06-29 08:54:16',NULL),(29,'baril','etienne','$2b$10$Ozfpzk9q0k98Q1pZHQ.piexaZHUBfK41Dhr1cfGN9iixkLIhU4eBu','etienne.baril@groupomania.com','1989-05-20','http://localhost:8080/images/images_(1).jpeg1624956928904.jpg',0,'2021-06-29 08:41:37','2021-06-29 08:55:28',NULL),(30,'sabourin','neuville','$2b$10$YnPk/eWN71FSe4nzGgQ/T.iPnM01KOl8ay/2RGJZKWGbd.qu5GLei','neuville.sabourin@groupomania.com','1994-06-11','http://localhost:8080/images/images_(1).png1624956366153.png',0,'2021-06-29 08:42:03','2021-06-29 08:46:06',NULL),(31,'mailloux','philip','$2b$10$FTCwlZBHRHb5.9L5TI5ELegw0Ype7hFtFgkVYQXT8PzeVwQmKVNKi','philip.mailloux@groupomania.com','1990-04-27','http://localhost:8080/images/images_(2).jpeg1624956524395.jpg',0,'2021-06-29 08:42:28','2021-06-29 08:48:44',NULL),(32,'marine','charpie','$2b$10$dh9ps3lSmJzAaFRQmdKGjuAg8hdOF2avTfUBoqQse6m3i6jMvQIq.','marine.charpie@groupomania.com','1985-06-11','http://localhost:8080/images/téléchargement.jpeg1624956807571.jpg',0,'2021-06-29 08:43:10','2021-06-29 08:53:27',NULL);
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-06-29 10:58:18
