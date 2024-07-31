import { Module } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [DevicesService],
  exports: [DevicesService]
})
export class DevicesModule {}
