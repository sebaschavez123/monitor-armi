enum CbFieldType {
  text = 1, numeric, select, checkbox
}

interface CbFields {
  label: string,
  type: CbFieldType,
  value: any,
  name: string,
  action?: Function,
  options?: any[]
}

export interface CbType {
    id: number,
    name : String,
    btnLabel?: string,
    disabled?: boolean,
    mdlTitle?: String,
    successText?: String,
    rejectText?: String,
    defValue?: number,
    marked?: boolean,
    fields?: CbFields[]
}

export const getChangeButtons = () : CbType[] => {
  return [
    {
      id: 1,
      name: 'ROUND_TRIP',
      btnLabel: 'Ida y Vuelta',
      disabled: false,
      defValue: 1,
      marked: false,
      mdlTitle: '¿Desea marcar la orde como ida y vuelta?',
      successText: 'La fue marcada como ida y vuelta',
      rejectText: 'No fue posible marcar la orden, intente mas tarde.',
    },
    {
      id: 2,
      name: 'TRANSFER',
      btnLabel: 'Registrar Transferencias',
      disabled: false,
      mdlTitle: 'Registro de transferencias',
      successText: 'La trasferencia fue registrada',
      rejectText: 'La trasferencia no fue registrada, intente mas tarde.',
      fields: [
        { 
          label: 'Transferencias',
          value: '', name: 'transfer',
          type: CbFieldType.select,
          options: [1,2,3,4,5,6,7,8,9,10]
        },
        { 
          label: 'Kilometraje',
          value: '', name: 'distance',
          type: CbFieldType.numeric
        }
      ]
    },
    {
      id: 3,
      name: 'PAYMENT_METHOD',
      btnLabel: 'Método de Pago',
      disabled: false,
      mdlTitle: 'Cambiar Metodo de pago',
      successText: 'Método de pago fué actualizado',
      rejectText: 'El método de pago no pudo ser actualizado, intente mas tarde.',
      fields: [
        { label: 'Metodo', value: '', name: 'payment_method', type: CbFieldType.select }
      ]
    }, {
      id: 4,
      name: 'DISTANCE',
      btnLabel: 'Cambio Kilometraje',
      disabled: false,
      mdlTitle: 'Cambiar Kilometraje',
      successText: 'Se ha modificado el kilometraje de la orden.',
      rejectText: 'No se ha podido modificar el kilometraje de la orden, intente mas tarde.',
      fields: [
        { label: 'Distancia', value: '', name: 'distance', type: CbFieldType.numeric }
      ]
    }

  ]
};