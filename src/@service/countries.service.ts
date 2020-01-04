import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import {Observable} from 'rxjs';

const allCountries = 'https://restcountries.eu/rest/v2/all';

@Injectable()
export class CountriesService  {
    countries: any[] = [];
    regions: string[] = [];
    subRegions: any = {};

    constructor(
        private _httpClient: HttpClient
    ) {}

    async iniSet(): Promise<void> {
        this.countries = await this.setCountries();
        this.setRegions();
    }

    private getAllInfo(): Observable<any[]> {
        return this._httpClient.get<any[]>(allCountries);
    }

    private setCountries(): Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => {
            this.getAllInfo()
                .pipe(
                    tap(() => console.log('***** calling countries')),
                    map(cs => {
                        return cs.map(
                            ({ name, alpha3Code, region, subregion }) => {
                                return { name, alpha3Code, region, subregion };
                            }
                        );
                    })
                ).subscribe(all => {
                resolve(all);
            });
        });
    }

    private setRegions(): void {
        this.countries.forEach(
            ({ region }) => {
                if (!this.regions.includes(region) && region !==  '') {
                    this.regions.push(region);
                }
            }
        );
        this.setSubRagions();
    }

    private setSubRagions(): void {
        this.regions.forEach(reg => {
            this.subRegions[reg] = this.findSubRegions(reg);
        });
    }

    private findSubRegions(region: string): any[] {
        const subRegions = [];
        (this.countries.filter(c => c.region === region)).forEach(({subregion}) => {
            if (!subRegions.includes(subregion) && subregion !== '') {
                subRegions.push(subregion);
            }
        });
        return subRegions;
    }
}
