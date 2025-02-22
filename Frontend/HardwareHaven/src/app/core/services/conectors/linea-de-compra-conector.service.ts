import { Injectable } from '@angular/core';
import { LineaCompraService } from '../entities/linea-compra.service';
import { SweetAlertService } from '../notifications/sweet-alert.service';

@Injectable({
  providedIn: 'root'
})
export class LineaDeCompraConectorService {
  private lineas: any[]=[];
  private linea: any;
  constructor(
    private serverLineaCompra: LineaCompraService,
    private sweetAlertService: SweetAlertService
  ) { }


  
  public getAll() {
    this.serverLineaCompra.getAll().subscribe({
      next: (r: any) => {
        try {
          if (r && r.data && Array.isArray(r.data)) {
            const lineas: any[] = r.data;
            this.lineas = lineas;
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
      }
    });
    return this.lineas
  }

  public delete(id:number) {
    this.serverLineaCompra.delete(id).subscribe({
      next: (r: any) => {
        try {
          if (r && r.data && Array.isArray(r.data)) {
            const linea: any = r.data;
            this.linea = linea;
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
      }
    });
    return this.linea
  }


  public update(id:number, 
    compraId: number,
    cantidad: number,
    subTotal: number,
    componenteId: number
  ) {
    this.serverLineaCompra.update(id,{
      compraId,
      cantidad,
      subTotal,
      componenteId
      }).subscribe({
      next: (r: any) => {
        try {
          if (r && r.data && Array.isArray(r.data)) {
            const linea: any = r.data;
            this.linea = linea;
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
      }
    });
    return this.linea
  }



  async InsertarLineaCompra() {
    const credenciales = await this.sweetAlertService.InsertLineaCompra();
    if (credenciales) {
      this.serverLineaCompra.create({
        compraId: credenciales.compraId,
        cantidad: credenciales.cantidad,
        componenteId: credenciales.componenteId
      }).subscribe({
        next: (r: any) => {
          try {
            if (r && r.data) {
              const lineaCompra: any = r.data; 
              this.linea = lineaCompra;
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


  async updateLineaCompra(lineaCompra:any) {
    const credenciales = await this.sweetAlertService.updateLineaCompra(lineaCompra);
    if (credenciales) {
      this.serverLineaCompra.update(
        lineaCompra.id, 
        {
        compraId: credenciales.compraId,
        cantidad: credenciales.cantidad,
        subTotal: credenciales.subTotal,
        componenteId: credenciales.componenteId
      }
      ).subscribe({
        next: (r: any) => {
          try {
            if (r && r.data) {
              const lineaCompra: any = r.data; 
              this.linea = lineaCompra;
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