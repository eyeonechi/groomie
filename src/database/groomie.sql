-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema y95ztl00tr4mkj78
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema y95ztl00tr4mkj78
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `y95ztl00tr4mkj78` DEFAULT CHARACTER SET latin1 ;
USE `y95ztl00tr4mkj78` ;

-- -----------------------------------------------------
-- Table `y95ztl00tr4mkj78`.`Customer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `y95ztl00tr4mkj78`.`Customer` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(48) NOT NULL,
  `password` VARCHAR(64) NOT NULL,
  `email` VARCHAR(64) NULL DEFAULT NULL,
  `phone` VARCHAR(32) NULL DEFAULT NULL,
  `address` VARCHAR(128) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `y95ztl00tr4mkj78`.`Dog`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `y95ztl00tr4mkj78`.`Dog` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(48) NULL DEFAULT NULL,
  `breed` VARCHAR(48) NULL DEFAULT NULL,
  `id_customer` INT(11) NULL DEFAULT NULL,
  `age` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `owner_idx` (`id_customer` ASC),
  CONSTRAINT `owner`
    FOREIGN KEY (`id_customer`)
    REFERENCES `y95ztl00tr4mkj78`.`Customer` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 20
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `y95ztl00tr4mkj78`.`Groomer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `y95ztl00tr4mkj78`.`Groomer` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(48) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `y95ztl00tr4mkj78`.`Appointment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `y95ztl00tr4mkj78`.`Appointment` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `location` VARCHAR(128) NULL DEFAULT NULL,
  `date` DATE NULL DEFAULT NULL,
  `time_start` TIME NULL DEFAULT NULL,
  `time_end` TIME NULL DEFAULT NULL,
  `id_customer` INT(11) NULL DEFAULT NULL,
  `id_groomer` INT(11) NULL DEFAULT NULL,
  `id_dog` INT(11) NULL DEFAULT NULL,
  `instructions` VARCHAR(128) NULL DEFAULT NULL,
  `groom_option` VARCHAR(64) NULL DEFAULT NULL,
  `name` VARCHAR(48) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `creator_idx` (`id_customer` ASC),
  INDEX `dog_idx` (`id_dog` ASC),
  INDEX `groomer_idx` (`id_groomer` ASC),
  CONSTRAINT `creator`
    FOREIGN KEY (`id_customer`)
    REFERENCES `y95ztl00tr4mkj78`.`Customer` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `dog`
    FOREIGN KEY (`id_dog`)
    REFERENCES `y95ztl00tr4mkj78`.`Dog` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `groomer`
    FOREIGN KEY (`id_groomer`)
    REFERENCES `y95ztl00tr4mkj78`.`Groomer` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 20
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `y95ztl00tr4mkj78`.`Feedback`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `y95ztl00tr4mkj78`.`Feedback` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `creator` INT(11) NULL DEFAULT NULL,
  `title` VARCHAR(48) NULL DEFAULT NULL,
  `content` VARCHAR(128) NULL DEFAULT NULL,
  `created` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `feedback_customer_idx` (`creator` ASC),
  CONSTRAINT `feedback_customer`
    FOREIGN KEY (`creator`)
    REFERENCES `y95ztl00tr4mkj78`.`Customer` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = latin1;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
