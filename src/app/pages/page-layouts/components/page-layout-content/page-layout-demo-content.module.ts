import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { PageLayoutDemoContentComponent } from './page-layout-demo-content.component';

@NgModule({
  declarations: [PageLayoutDemoContentComponent],
  imports: [
    CommonModule,
    SirioSharedModule
  ],
  exports: [PageLayoutDemoContentComponent]
})
export class PageLayoutDemoContentModule {
}
