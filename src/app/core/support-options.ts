export const SUPPORT_OPTIONS = [
    {
      ndx: 1,
      icon: '/assets/svg/support/option-01.svg',
      name: 'Dudas con el cobro',
      desc: 'Aquí encuentras la factura de tu pedido, si tienes alguna duda escríbenos para poder ayudarte.',
      invoice: {src: '/assets/svg/support/invoice.jpg'},
      widgets: [
        {
          wtype: 'list',
          title: 'Tipo de incidente',
          options: [
            {
              id: 1,
              cat: 'dudas_con_el_cobro_doble_cobro',
              uid: 'dobles_cobros',
              desc: 'Doble Cobro',
              ticketOn: true,
              chatOn: false
            },
            {
              id: 2,
              cat: 'dudas_con_el_cobro_doble_cobro',
              uid: 'pago_rechazado',
              desc: 'Pago rechazado',
              chatOn: true
            },
            {
              id: 3,
              cat: 'dudas_con_el_cobro_doble_cobro',
              uid: 'cobrado_en_línea_y_no_entregado',
              desc: 'Cobrado en línea y no entregado',
              chatOn: true
            },
            {
              id: 4,
              cat: 'dudas_con_el_cobro_doble_cobro',
              uid: 'error_en_facturación',
              desc: 'Error de facturación',
              ticketOn: true,
              chatOn: false
            },
          ],
          checked: null,
        },
        {
          wtype: 'textblock',
          title: 'Escríbenos tus comentarios:',
          comment: '',
        },
      ],
      asistencia: 360064947072,
      callback: 'doubleCobro',
    },
    {
      ndx: 2,
      icon: '/assets/svg/support/option-02.svg',
      name: 'Incidente con el mensajero',
      desc: 'Nuestro personal ya está al tanto de lo sucedido.<br>A continuación te'
      + ' damos la información de tu caso para que le puedas hacer seguimiento.',
      widgets: [
        {
          wtype: 'list',
          options: [
            /*{
              id: 1,
              cat: 'incidente_con_el_mensajero',
              uid: 'otros',
              desc: 'Tiempo de entrega',
            },*/
            {
              id: 2,
              cat: 'incidente_con_el_mensajero',
              uid: 'mala_actitud',
              desc: 'Mala actitud',
            },
            {
              id: 3,
              cat: 'incidente_con_el_mensajero',
              uid: 'mala_presentación',
              desc: 'Mala presentación',
            },
            /*{
              id: 4,
              cat: 'incidente_con_el_mensajero',
              uid: 'cobró_antes_de_entregar',
              desc: 'Cobró antes de entregar',
            },*/
            {
              id: 5,
              cat: 'incidente_con_el_mensajero',
              uid: 'problemas_con_el_datáfono',
              desc: 'Problemas con el datáfono',
            },
            /*{
              id: 6,
              cat: 'incidente_con_el_mensajero',
              uid: 'método_de_pago',
              desc: 'Método de pago',
            },
            {
              id: 7,
              cat: 'incidente_con_el_mensajero',
              uid: 'otros',
              desc: 'Otro',
            },*/
          ],
          values: null,
        },
        {
          wtype: 'textblock',
          title: 'Escríbenos tus comentarios:',
        },
      ],
      messenger: true,
      callback: 'incidenteMensajero',
    },
    {
      ndx: 3,
      icon: '/assets/svg/support/option-03.svg',
      name: 'Producto llegó en mal estado',
      file: null,
      uid: 'producto_llegó_en_mal_estado',
      desc: 'Selecciona el producto que llegó en mal estado y escríbenos para poder ayudarte.',
      widgets: [
        {
          wtype: 'products-list',
          products: [],
          values: null,
        },
        {
          wtype: 'textblock',
          title: 'Escríbenos tus comentarios:',
        },
        {
          wtype: 'image-unload',
          title: 'Adjuntar imagen del producto:',
          source: '',
        },
      ],
      callback: 'malEstado',
    },
    {
      ndx: 4,
      icon: '/assets/svg/support/option-04.svg',
      name: 'Mi pedido llegó incompleto',
      uid: 'mi_pedido_llegó_incompleto',
      desc: 'Selecciona el producto que no te llegó y escríbenos para poder ayudarte.',
      widgets: [
        {
          wtype: 'products-list',
          products: [],
          values: null,
        },
        {
          wtype: 'textblock',
          title: 'Escríbenos tus comentarios:',
        },
      ],
      callback: 'pedidoIncompleto',
    },
    {
      ndx: 6,
      _id: 'cupon',
      icon: '/assets/svg/support/option-06.svg',
      name: 'No se aplicó la promoción o el cupón',
      desc: 'Escribe el código del cupón o cuéntanos cuál fue la promoción que no se aplicó para poder ayudarte.',
      uid: 'no_se_aplico_promoción_o_cupón',
      widgets: [
        {
          wtype: 'textfield',
          name: 'cupon',
          value: '',
          title: 'Código del cupón:',
          placeholder: 'Escribe aquí el código',
        },
        {
          wtype: 'textblock',
          title: 'Escríbenos tus comentarios:',
        },
      ],
      callback: 'cuponPromo',
    },
    {
      ndx: 8,
      icon: '/assets/svg/support/option-09.svg',
      name: 'Llegó otro producto',
      uid: 'llegó_otro_producto',
      desc: 'Escríbenos o adjunta la imagen del producto que te llegó  y cuéntanos que quieres que hagamos para poder ayudarte.',
      widgets: [
        {
          wtype: 'textblock',
          title: 'Escríbenos tus comentarios:',
        },
        {
          wtype: 'image-unload',
          title: 'Adjuntar imagen del producto:',
          source: '',
        },
      ],
      callback: 'otroProducto',
    },
    {
        ndx: 9,
        icon: '/assets/svg/support/option-04.svg',
        name: 'Estado de mi pedido',
        desc: 'Escríbenos tu problema y cuéntanos que quieres que hagamos para poder ayudarte.',
        file: null,
        invoice: {src: '/assets/svg/support/invoice.jpg'},
        uid: 'estado_de_mi_pedido',
        widgets: [
          {
            wtype: 'list',
            title: 'Tipo de incidente',
            options: [
              {
                id: 1,
                cat: 'estado_de_mi_pedido',
                uid: 'donde_esta_mi_pedido',
                desc: 'Donde esta mi pedido',
                ticketOn: false,
                chatOn: true
              },
              {
                id: 2,
                cat: 'estado_de_mi_pedido',
                uid: 'mi_pedido_se_demoro_en_llegar',
                desc: 'Mi pedido se demoro en llegar',
                ticketOn: false,
                chatOn: true
              },
              {
                id: 3,
                cat: 'estado_de_mi_pedido',
                uid: 'mi_pedido_no_fue_entregado',
                desc: 'Mi pedido no fue entregado',
                ticketOn: false,
                chatOn: true
              },
            ],
            checked: null,
          }
        ],
        chatOn: true,
        callback: 'notCallback'
    },
    {
        ndx: 10,
        icon: '/assets/svg/support/option-01.svg',
        name: 'Mi factura',
        desc: 'Escríbenos tu problema y cuéntanos que quieres que hagamos para poder ayudarte.',
        file: null,
        invoice: {src: '/assets/svg/support/invoice.jpg'},
        uid: 'mi_factura',
        widgets: [
          {
            wtype: 'list',
            title: 'Tipo de incidente',
            options: [
              {
                id: 1,
                cat: 'mi_factura',
                uid: 'copia_de_factura_pos',
                desc: 'Copia de factura pos',
                ticketOn: true,
              },
              {
                id: 2,
                cat: 'mi_factura',
                uid: 'historial_de_facturas',
                desc: 'Historial de facturas',
                ticketOn: true,
              },
              {
                id: 3,
                cat: 'mi_factura',
                uid: 'factura_electronica',
                desc: 'Factura electrónica',
                ticketOn: true,
              },
              {
                id: 4,
                cat: 'mi_factura',
                uid: 'personalizacion_de_factura',
                desc: 'Personalización de factura',
                ticketOn: true,
              },
            ],
            checked: null,
          },
          {
            wtype: 'textblock',
            title: 'Escríbenos tus comentarios:',
            comment: '',
          },
        ],
        chatOn: true,
        callback: 'miFactura'
    }
  ];