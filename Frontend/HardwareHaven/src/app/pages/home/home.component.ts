import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserService } from '../../core/services/entities/user.service.js';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; 
import { FormsModule } from '@angular/forms';
import { SweetAlertService } from '../../core/services/notifications/sweet-alert.service.js';
import { ToastService } from '../../core/services/notifications/toast.service.js';
import { SessionService } from '../../core/services/share/session.service.js';
import { CommonModule } from '@angular/common';

declare var bootstrap: any; 

@Component({
  selector: 'home',
  standalone: true,
  imports: [HttpClientModule, FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [UserService]
})
export class HomeComponent implements OnInit {
  private users: any[] = [];
  private user: any;
  public username: string = '';
  public password: string = '';
  public recordarClave: boolean = false;
  private intervalId: any;
  public errorServer: boolean = false;
  constructor(
    private serverUser: UserService, 
    private router: Router, 
    private sweetAlertService: SweetAlertService,
    private toastService: ToastService,
    
  ) {}

  

  ngOnInit(): void {
    this.sweetAlertService.recibirOfertas();
    if(SessionService.recordarSession()){
      this.router.navigate(['productList']);
    }
    else{
      this.getAllUsers();
    }

     
    this.iniciarCarousel(5000);
  }

  iniciarCarousel(time:number){
    const myCarousel = document.querySelector('#carouselExample') as HTMLElement;
    const carousel = new bootstrap.Carousel(myCarousel, {
      interval: time, 
      ride: 'carousel'
    });

  
    this.intervalId = setInterval(() => {
      carousel.next();
    }, time); 
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  login() {
    const user = this.users.find(x => 
      x.name.toLowerCase().includes(this.username.toLowerCase()) && 
      x.password.includes(this.password) &&
      this.username !== '' && this.password !== ''
    );

    if (this.username.trim() === '' || this.password.trim() === '') {
      console.log('Por favor ingrese un nombre de usuario y una contraseña.');
      this.toastService.showToast('Por favor ingrese un nombre de usuario y una contraseña.');
      return;
    }
    
    if (user) {
      SessionService.usuario = user
      if(this.recordarClave){SessionService.guardarSession();}
      if(user.tipoUsuario ==="administrador"){
        this.router.navigate(['inventario']); 
      }
      else{
        this.router.navigate(['productList']);
      }
      
      
    } else {
      this.toastService.showToast('Acceso denegado');
      
    }
  }

  

  getAllUsers() {
    this.serverUser.getAll().subscribe({
      next: (r: any) => {
        try {
          if (r && r.data && Array.isArray(r.data)) {
            const users: any[] = r.data; 
            this.users = users;
            this.errorServer=false;
          } else {
            console.log('El objeto recibido no tiene la estructura esperada.');
          }
        } catch (error) {
          console.error('Error al procesar los datos:', error);
          console.log('Objeto recibido:', r); 
        }
      },
      error: (e) => {
        console.error('Error en la llamada HTTP:', e);
        this.errorServer=true;
      }
    });
  }




async registrarUsuario() {
    const credenciales = await this.sweetAlertService.mostrarFormularioRegistro();
    if (credenciales) {
      this.serverUser.create({name:credenciales.username, password:credenciales.password, email:credenciales.email, tipoUsuario: credenciales.userType}).subscribe({
        next: (r: any) => {
          try {
            if (r && r.data) {
              const user: any = r.data; 
              this.user = user;
              SessionService.usuario = this.user
              if(user.tipoUsuario ==="administrador"){
                this.router.navigate(['inventario']); 
              }
              else{
                this.router.navigate(['productList']);
              }
            } else {
              
            }
          } catch (error) {
            console.error('Error al procesar los datos:', error);
            console.log('Objeto recibido:', r); 
          }
        },
        error: (e) => {
          console.error('Error en la llamada HTTP:', e);
        }
      });
      
    }
    
  }
  
  
  





}
