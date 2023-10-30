import { NgModule } from '@angular/core'

// pipes
import { AbbCourierName } from './abbCourierName.pipe'
import { SafePipe } from './safe.pipe'
import { TimestampPipe } from './timestamp.pipe'
import { CurrencyformatPipe } from './money.pipe'

const PIPES = [
    AbbCourierName,
    TimestampPipe,
    SafePipe,
    CurrencyformatPipe
]

@NgModule({
  imports: [],
  declarations: [...PIPES],
  exports: [...PIPES],
})

export class PipesModule {}