import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  SirioCard,
  SirioCardActions,
  SirioCardContent,
  SirioCardHeader,
  SirioCardHeaderActions,
  SirioCardHeaderSubTitle,
  SirioCardHeaderTitle
} from './card.component';

const cardComponents = [
  SirioCard,
  SirioCardHeader,
  SirioCardHeaderTitle,
  SirioCardHeaderSubTitle,
  SirioCardHeaderActions,
  SirioCardContent,
  SirioCardActions
];

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ...cardComponents
  ],
  exports: [
    ...cardComponents
  ]
})
export class SirioCardModule {
}
