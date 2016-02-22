-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Client :  127.0.0.1
-- Généré le :  Lun 22 Février 2016 à 13:24
-- Version du serveur :  5.6.17
-- Version de PHP :  5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données :  `peridot`
--

-- --------------------------------------------------------

--
-- Structure de la table `auth_tokens`
--

CREATE TABLE IF NOT EXISTS `auth_tokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `create_date` datetime NOT NULL,
  `expire_date` datetime NOT NULL,
  `token` varchar(45) NOT NULL,
  `ip_address` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Contenu de la table `auth_tokens`
--

INSERT INTO `auth_tokens` (`id`, `user_id`, `create_date`, `expire_date`, `token`, `ip_address`) VALUES
(1, 1, '2016-02-18 21:39:00', '2016-03-18 21:39:00', 'b5KxsF4ucyBVgHTP', '::1'),
(2, 1, '2016-02-18 21:50:02', '2016-03-18 21:50:02', 'I80NZ8wHI2hR7Ouc', '::1'),
(3, 1, '2016-02-19 21:35:57', '2016-03-19 21:35:57', 'kQEXKKnAPCZkyN10', '::1'),
(4, 1, '2016-02-19 22:00:15', '2016-03-19 22:00:15', 'nKDSnpxUt11Qime3', '::1');

-- --------------------------------------------------------

--
-- Structure de la table `channels`
--

CREATE TABLE IF NOT EXISTS `channels` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `image_url` varchar(300) NOT NULL,
  `create_date` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Contenu de la table `channels`
--

INSERT INTO `channels` (`id`, `name`, `image_url`, `create_date`) VALUES
(1, 'Lorem Ipsum TV', '', '2016-02-11 00:00:00');

-- --------------------------------------------------------

--
-- Structure de la table `channel_files`
--

CREATE TABLE IF NOT EXISTS `channel_files` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `channel_id` int(11) NOT NULL,
  `url` longtext NOT NULL,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Contenu de la table `channel_files`
--

INSERT INTO `channel_files` (`id`, `channel_id`, `url`, `name`) VALUES
(1, 1, 'https://r5---sn-25ge7nld.googlevideo.com/videoplayback?id=c8c55e790d222f6e&itag=22&source=webdrive&begin=0&requiressl=yes&mm=30&mn=sn-25ge7nld&ms=nxu&mv=m&nh=IgpwcjAxLnBhcjAxKgkxMjcuMC4wLjE&pl=22&mime=video/mp4&lmt=1455826556364958&mt=1455924982&ip=85.68.48.164&ipbits=8&expire=1455953918&sparams=ip,ipbits,expire,id,itag,source,requiressl,mm,mn,ms,mv,nh,pl,mime,lmt&signature=B2C09A6C0F57EFF0085673A99FDD4C7ABF0308B8.95E1CD9A4C6C5AD939E27B73589D2DB282E4F3DF&key=ck2', 'Gravity Falls Season Final'),
(2, 1, 'https://soundcloud.com/bradbreeck/gf-e221-weirdmageddon-3-pt-1-full-score', 'fezfef'),
(3, 1, 'https://www.reddit.com/r/StarWars/comments/3ye8ra/star_wars_the_force_awakens_bluray_coming_april/', 'fregrfeg');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nickname` varchar(25) NOT NULL,
  `first_name` varchar(45) NOT NULL,
  `family_name` varchar(45) NOT NULL,
  `email` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL,
  `signup_date` datetime NOT NULL,
  `avatar_url` varchar(500) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Contenu de la table `users`
--

INSERT INTO `users` (`id`, `nickname`, `first_name`, `family_name`, `email`, `password`, `signup_date`, `avatar_url`) VALUES
(1, 'CYRIAQU3', '', '', 'cyriaquedelaunay@gmail.com', 'sha1$acab6570$1$78123a3a5c4cd8e7ca63c2a3993ceeb44168d216', '0000-00-00 00:00:00', '');

-- --------------------------------------------------------

--
-- Structure de la table `user_channels`
--

CREATE TABLE IF NOT EXISTS `user_channels` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `channel_id` int(11) NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Contenu de la table `user_channels`
--

INSERT INTO `user_channels` (`id`, `user_id`, `channel_id`, `date`) VALUES
(1, 1, 1, '2016-02-21 00:00:00');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
