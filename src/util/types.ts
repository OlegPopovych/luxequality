'use strict';

export type Advert = {
	id: string;
	name: string;
	location: string;
	coords: string;
	price: string;
  desc: string;
	imageUrl: string;
	createdAt: string;
};

export interface PointType {
	lat: number;
	lng: number;
	title: string;
}

export enum InfoType {
  All = 'all',
  One = 'one',
}

export enum MapType {
  Modal = 'modal',
}
