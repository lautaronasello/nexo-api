import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, Matches } from 'class-validator';

export class CreateMerchantDto {
  @ApiProperty({
    description: 'Business name of the merchant',
    example: 'Canchas La Redonda FC',
  })
  @IsString()
  @IsNotEmpty()
  businessName: string;

  @ApiProperty({
    description: 'CUIT tax identifier (11 digits, hyphenated or numeric)',
    example: '30-71234567-8',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(\d{2}-?\d{8}-?\d{1})$/, {
    message: 'CUIT format must be valid (e.g. 30-71234567-8 or 30712345678)',
  })
  cuit: string;

  @ApiProperty({
    description: 'Contact email address',
    example: 'contacto@laredonda.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
