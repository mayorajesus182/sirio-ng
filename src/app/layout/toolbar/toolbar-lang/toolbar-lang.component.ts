import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Idioma, IdiomaService } from 'src/@sirio/domain/services/preferencias/idioma.service';
import { LIST_FADE_ANIMATION } from '../../../../@sirio/shared/list.animation';

@Component({
  selector: 'sirio-toolbar-lang',
  templateUrl: './toolbar-lang.component.html',
  styleUrls: ['./toolbar-lang.component.scss'],
  animations: [...LIST_FADE_ANIMATION],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarLangComponent implements OnInit {

  notifications: any[];
  isOpen: boolean;

  public availableLangs = [] as Idioma[];
  currentLang = {
    nombre: 'ES',
    id: 'ES',
    icono: 'flag-icon-es'
  } as Idioma;

  constructor(
    private translate: TranslateService,
    private idiomaService: IdiomaService,
    ) {
  }

  ngOnInit() {


    if(localStorage.getItem('sirio-lang')){
      this.currentLang = JSON.parse(localStorage.getItem('sirio-lang'));
    }

    this.translate.use(this.currentLang.id.toLowerCase());

    this.idiomaService.actives().subscribe(data => {
      // console.log(data);
      this.availableLangs = data;
    }, err => {
      // this.currentLang = ;
      this.translate.use(this.currentLang.id.toLowerCase());
    })
    
  }


  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  onClickOutside() {
    this.isOpen = false;
  }

  setLang(lng: Idioma) {
    this.currentLang = lng;
    localStorage.setItem('sirio-lang',JSON.stringify(lng));
    this.translate.use(lng.id.toLowerCase());
  }

}
