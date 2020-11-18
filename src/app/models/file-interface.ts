export interface File {
    fileInfo: FileInfo;
    path: string;
    _id?: string;
}

export class FileInfo {
    // lastModified: number;
    // lastModifiedDate: Date;
    name: string;
    size: number;
    file_type: string;
    ownerId: string;
    // webkitRelativePath: string;
}
