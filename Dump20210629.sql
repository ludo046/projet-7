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
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Comments`
--

LOCK TABLES `Comments` WRITE;
/*!40000 ALTER TABLE `Comments` DISABLE KEYS */;
INSERT INTO `Comments` VALUES (63,168,'ok pour moi ',NULL,NULL,0,'2021-06-28 15:27:57','2021-06-28 15:27:57',24),(64,168,'c\'est d\'accord pour moi aussi ',NULL,NULL,0,'2021-06-28 15:31:45','2021-06-28 15:39:30',25),(65,168,'moi je vais pas être dispo ce soir désolé ',NULL,NULL,1,'2021-06-28 15:34:51','2021-06-28 15:39:23',26),(67,168,'ok pour moi aussi',NULL,NULL,0,'2021-06-29 07:59:15','2021-06-29 07:59:15',27);
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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LikeComments`
--

LOCK TABLES `LikeComments` WRITE;
/*!40000 ALTER TABLE `LikeComments` DISABLE KEYS */;
INSERT INTO `LikeComments` VALUES (10,65,27,1,'2021-06-28 15:39:23','2021-06-28 15:39:23',NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Likes`
--

LOCK TABLES `Likes` WRITE;
/*!40000 ALTER TABLE `Likes` DISABLE KEYS */;
INSERT INTO `Likes` VALUES (17,168,24,1,'2021-06-28 15:27:47','2021-06-28 15:27:47'),(19,169,24,1,'2021-06-28 15:30:15','2021-06-28 15:30:15'),(20,168,25,1,'2021-06-28 15:31:28','2021-06-28 15:31:28'),(21,169,25,1,'2021-06-28 15:32:28','2021-06-28 15:32:28'),(22,168,26,1,'2021-06-28 15:34:58','2021-06-28 15:34:58'),(39,172,27,1,'2021-06-29 07:58:54','2021-06-29 07:58:54'),(40,168,27,1,'2021-06-29 07:59:03','2021-06-29 07:59:03');
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
) ENGINE=InnoDB AUTO_INCREMENT=173 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Messages`
--

LOCK TABLES `Messages` WRITE;
/*!40000 ALTER TABLE `Messages` DISABLE KEYS */;
INSERT INTO `Messages` VALUES (168,23,'salut tous le monde un petit apéro après le travail ',NULL,NULL,5,'2021-06-28 15:26:42','2021-06-29 07:59:03'),(169,24,'bonne après-midi à tous =) ','http://localhost:8080/images/google-tenor.gif1624894202704.gif',NULL,2,'2021-06-28 15:30:02','2021-06-28 15:47:05'),(172,27,'je suis la nouvelle admin je vous surveille attention ',NULL,'http://localhost:8080/images/essayer-de-ne-pas-rire-video-de-chat-a-mourir-de-rire-11.mp41624953359228.undefined',1,'2021-06-29 07:55:59','2021-06-29 07:58:54');
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
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (23,'Déziel','Carole','$2b$10$Hyvz6n7bKXVIDnKZltG6HuEFeciPTiZoYGR4EvgSkWDLtdSZsSqVW','carole.deziel@groupomania.com','1988-02-09','http://localhost:8080/images/téléchargement.jpeg1624893969143.jpg',0,'2021-06-28 15:11:44','2021-06-28 15:26:09',NULL),(24,'baril','étienne','$2b$10$6K6RXdpmrpqD1T/mfq2gqOW1TrEVmdgue0YUXJbD2c/2P76u9aVM.','etienne.baril@groupomania.com','1982-07-15','http://localhost:8080/images/images_(1).png1624894116231.png',0,'2021-06-28 15:13:40','2021-06-28 15:28:36',NULL),(25,'sabourin','neville','$2b$10$KZ5ONydwTNRjS5m50RxP7u/RolPN5ZXq..EuJuxqO8CXOtjlF5FFm','neuville.sabourin@groupomania.com','1996-06-01','http://localhost:8080/images/images_(2).jpeg1624894330538.jpg',0,'2021-06-28 15:14:53','2021-06-28 15:32:10',NULL),(26,'mailloux','philip','$2b$10$jNWEMwkTG9xTmvlq1kZB.Or1FyBMB.j4olwmnsVrHXr2JMBS37nc.','philip.mailloux@groupomania.com','1990-01-09','http://localhost:8080/images/images_(1).jpeg1624894460589.jpg',0,'2021-06-28 15:17:07','2021-06-28 15:34:20',NULL),(27,'marine','charpie','$2b$10$/xLvqzh0SrjkhrDX.xZOY.725.XaAAsv7aclwuzpFYrxZV.nVgjIu','marine.charpie@groupomania.com','1984-07-12','http://localhost:8080/images/téléchargement.jpeg1624953281090.jpg',1,'2021-06-28 15:17:53','2021-06-29 07:54:41',NULL);
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

-- Dump completed on 2021-06-29 10:09:04
