import { FuseUtils } from '@fuse/utils';

export class OportunidadModel
{
    id: string;
    potential_no: string;
    assigned_user_id: string;
    contact_id: string;
    description: string;
    potentialname: string;
    related_to: string;
    sales_stage: string;
    service_status: string;

    /**
     * Constructor
     *
     * @param entidad
     */
    constructor(entidad)
    {
        {
            this.id = entidad.id || null;
            this.potential_no = entidad.potential_no || null;
            this.assigned_user_id = entidad.assigned_user_id || null;
            this.contact_id = entidad.contact_id || null;
            this.description = entidad.description || '';
            this.related_to = entidad.related_to || null;
            this.potentialname = entidad.potentialname || '';
            this.sales_stage = entidad.sales_stage || null;
            this.service_status = entidad.service_status || null;
        }
    }
}

export const OportunidadesConst = {
    name: 'Oportunidad',
    names: 'Oportunidades',
    icon: 'shopping_basket',
    urlEntidades: '/apps/jumbomod/oportunidades',
    urlEntidad: '/apps/jumbomod/oportunidades'
};
