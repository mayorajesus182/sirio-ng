import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { NotFoundComponent } from "./not-found/not-found.component";

const errorsRoutes: Routes = [
  {
    path: "",
    children: [      
      {
        path: "404",
        component: NotFoundComponent,
        data: { title: "404" }
      },
      {
        path: "403",
        component: NotFoundComponent,
        data: { title: "403" }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(errorsRoutes)],
  exports: [RouterModule]
})
export class ErrorsRoutingModule {
}