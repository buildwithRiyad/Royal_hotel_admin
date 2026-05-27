//admin_pipe er pipe()

import {PipeTransform,Injectable,BadRequestException,ArgumentMetadata} from '@nestjs/common';
import {plainToInstance} from 'class-transformer';
import {validate} from 'class-validator';
import {CreateUserDto, UpdateUserDto, AssignRoleDto} from '../dto/admin.dto';

@Injectable()
export class Admin_pipe implements PipeTransform
{
    async transform(value:any, metadata: ArgumentMetadata)
    {

        if (!value || typeof value !== 'object') {
      throw new BadRequestException('Validation failed: No data submitted');
    }

    
    const DtoClass = metadata.metatype || CreateUserDto;
    
    const dtoObject=plainToInstance(DtoClass,value);

        const errors=await validate(dtoObject);

        if(errors.length>0)
        {
            const message=errors.map(err=>Object.values(err.constraints || {})).flat();
            throw new BadRequestException(message);
        }
        if(value.nidImage)
        {
            const maxSize=2*1024*1024;
            if (value.nidImage.size > maxSize) {
        throw new BadRequestException('NID image must not exceed 2MB');
      }

        }
         return value;

    }
}