-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Client :  127.0.0.1
-- Généré le :  Lun 22 Février 2016 à 15:23
-- Version du serveur :  10.1.9-MariaDB
-- Version de PHP :  5.5.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `peridot`
--

-- --------------------------------------------------------

--
-- Structure de la table `auth_tokens`
--

CREATE TABLE `auth_tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `create_date` datetime NOT NULL,
  `expire_date` datetime NOT NULL,
  `token` varchar(45) NOT NULL,
  `ip_address` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `auth_tokens`
--

INSERT INTO `auth_tokens` (`id`, `user_id`, `create_date`, `expire_date`, `token`, `ip_address`) VALUES
(1, 1, '2016-02-18 21:39:00', '2016-03-18 21:39:00', 'b5KxsF4ucyBVgHTP', '::1'),
(2, 1, '2016-02-18 21:50:02', '2016-03-18 21:50:02', 'I80NZ8wHI2hR7Ouc', '::1'),
(3, 1, '2016-02-19 21:35:57', '2016-03-19 21:35:57', 'kQEXKKnAPCZkyN10', '::1'),
(4, 1, '2016-02-19 22:00:15', '2016-03-19 22:00:15', 'nKDSnpxUt11Qime3', '::1'),
(5, 1, '2016-02-22 14:18:04', '2016-03-22 14:18:04', 'FIAfLNaZX4gK5VYm', '::1');

-- --------------------------------------------------------

--
-- Structure de la table `channels`
--

CREATE TABLE `channels` (
  `id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `image_url` varchar(300) NOT NULL,
  `create_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `channels`
--

INSERT INTO `channels` (`id`, `name`, `image_url`, `create_date`) VALUES
(1, 'Lorem Ipsum TV', '', '2016-02-11 00:00:00');

-- --------------------------------------------------------

--
-- Structure de la table `files`
--

CREATE TABLE `files` (
  `id` int(11) NOT NULL,
  `channel_id` int(11) NOT NULL,
  `url` longtext NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `files`
--

INSERT INTO `files` (`id`, `channel_id`, `url`, `name`) VALUES
(1, 1, 'https://r5---sn-25ge7nld.googlevideo.com/videoplayback?id=c8c55e790d222f6e&itag=22&source=webdrive&begin=0&requiressl=yes&mm=30&mn=sn-25ge7nld&ms=nxu&mv=m&nh=IgpwcjAxLnBhcjAxKgkxMjcuMC4wLjE&pl=22&mime=video/mp4&lmt=1455826556364958&mt=1455924982&ip=85.68.48.164&ipbits=8&expire=1455953918&sparams=ip,ipbits,expire,id,itag,source,requiressl,mm,mn,ms,mv,nh,pl,mime,lmt&signature=B2C09A6C0F57EFF0085673A99FDD4C7ABF0308B8.95E1CD9A4C6C5AD939E27B73589D2DB282E4F3DF&key=ck2', 'Gravity Falls Season Final');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nickname` varchar(25) NOT NULL,
  `first_name` varchar(45) NOT NULL,
  `family_name` varchar(45) NOT NULL,
  `email` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL,
  `signup_date` datetime NOT NULL,
  `avatar_url` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `users`
--

INSERT INTO `users` (`id`, `nickname`, `first_name`, `family_name`, `email`, `password`, `signup_date`, `avatar_url`) VALUES
(1, 'CYRIAQU3', '', '', 'cyriaquedelaunay@gmail.com', 'sha1$acab6570$1$78123a3a5c4cd8e7ca63c2a3993ceeb44168d216', '0000-00-00 00:00:00', '');

-- --------------------------------------------------------

--
-- Structure de la table `user_channels`
--

CREATE TABLE `user_channels` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `channel_id` int(11) NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `user_channels`
--

INSERT INTO `user_channels` (`id`, `user_id`, `channel_id`, `date`) VALUES
(1, 1, 1, '2016-02-21 00:00:00');

--
-- Index pour les tables exportées
--

--
-- Index pour la table `auth_tokens`
--
ALTER TABLE `auth_tokens`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `channels`
--
ALTER TABLE `channels`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `user_channels`
--
ALTER TABLE `user_channels`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `auth_tokens`
--
ALTER TABLE `auth_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT pour la table `channels`
--
ALTER TABLE `channels`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT pour la table `files`
--
ALTER TABLE `files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT pour la table `user_channels`
--
ALTER TABLE `user_channels`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
