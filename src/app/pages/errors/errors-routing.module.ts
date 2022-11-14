import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ForbiddenComponent } from "./forbidden/forbidden.component";

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
        component: ForbiddenComponent,
        data: { title: "403" }
      },
      {
        path: "session-lost",
        component: ForbiddenComponent,
        data: { title: "Sesión Perdida" }
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