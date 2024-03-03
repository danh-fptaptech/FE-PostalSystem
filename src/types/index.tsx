export interface ApiResponse {
	ok: boolean;
	status: string;
	message: string;
	data?: any;
}

export interface ImageType {
	name: string;
	width: number;
	height: number;
	alt?: string;
}
