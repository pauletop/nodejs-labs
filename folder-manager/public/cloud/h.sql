ALTER TABLE `phone`
ADD CONSTRAINT `fk_phone_manufacture` FOREIGN KEY (MID) REFERENCES `manufacture`(ID)

