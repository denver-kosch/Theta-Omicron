import type { JSX } from "react/jsx-runtime";
import type { CSSProperties, ReactNode } from "react";
import type { NavigateFunction } from "react-router-dom";

export type EventType = {
    _id: string;
    name: string;
    description?: string;
    time: {
        start: string;
        end: string;
    },
    imageUrl?: string;
    location?: string;
};

export type EventDetailsType = Omit<EventType, "description" | "imageUrl" | "location"> & {
    description: string;
    imageUrl: string;
    committee: {
        id: string;
        type: string;
    };
    location: {
        name: string;
        address?: string;
        city?: string;
        state?: string;
        zip?: string;
        country?: string;
    };
};

export type DateRangeProps = {
    date1: Date;
    date2: Date;
};

export type EventCardType = {
    event: EventType;
    loggedIn?: boolean;
};

export type Coordinates = {
    lat: number;
    lng: number;
};

export type MapViewProps = {
    coordinates: Coordinates;
};

export type EventStatus = "Pending" | "Approved" | "Rejected";

export type EventTableRow = {
    _id: string;
    name: string;
    description: string;
    start: string;
    end: string;
    locationName: string;
    visibility: string;
    committeeName: string;
    mandatory: boolean;
    status?: EventStatus;
};

export type EventTableCollection = "approved" | "past" | "comEvents" | "rejEvents";

export type EventTableCollections = Record<EventTableCollection, EventTableRow[]>;

export type EventTableSort = {
    key: keyof EventTableRow | null;
    direction: "ascending" | "descending";
};

export type EventTableProps = {
    events: EventTableCollections | null;
    collection: EventTableCollection;
    sort: EventTableSort;
    navigate: NavigateFunction;
    emptyRow: (columnCount: number) => JSX.Element;
    status: boolean;
};

export type EventTableRowProps = {
    event: EventTableRow;
    navigate: NavigateFunction;
};

export type DropdownContent = {
    parent: {
        title: ReactNode;
        link: string;
    };
    children: {
        title: string;
        link: string;
    }[];
};

export type DropdownProps = {
    content: DropdownContent;
};

export type NavbarProps = {
    children: ReactNode;
};

export type MemberPosition = {
    committeeName?: string;
    role?: string;
    title?: string;
    ecOrder?: number;
    bio?: string;
};

export type MemberType = {
    _id?: string;
    firstName: string;
    lastName: string;
    contactInfo?: {
        schoolEmail?: string;
        email?: string;
    };
    imageUrl: string;
    positions?: Array<MemberPosition | string>;
    position?: MemberPosition | ReactNode;
};

export type BrothersGridProps = {
    brothers: MemberType[];
};

export type MemberCardProps = {
    member: MemberType;
};

export type ExecutiveCommitteeProps = {
    members: ExecutiveMemberType[];
};

export type DirectoryMemberType = Omit<MemberType, "position" | "positions"> & {
    positions: string[];
};

export type ChairmanMemberType = Omit<MemberType, "position" | "positions"> & {
    positions: Array<MemberPosition & { committeeName: string; role: string }>;
};

export type CommitteeMemberType = Omit<MemberType, "position"> & {
    position: MemberPosition & { role: string };
};

export type ExecutiveMemberType = Omit<CommitteeMemberType, "position"> & {
    position: MemberPosition & {
        role: string;
        ecOrder: number;
        bio: string;
    };
};

export type ApiResponse<T extends object> =
    | ({ success: true } & T)
    | { success: false; error: string };

export type ApiRequestOptions = {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    headers?: Record<string, string>;
};

export type AuthProps = {
    children: ReactNode;
};

export type PortalMemberInfo = {
    firstName: string;
    lastName: string;
    status: "Pledge" | "Initiate" | "Alumnus";
};

export type CommitteePositionType = {
    committeeName: string;
    role: string;
};

export type CommitteePositionProps = {
    position: CommitteePositionType;
};

export type EventTableSegmentProps = {
    title: string;
    collection: EventTableCollection;
    status: boolean;
    sort: EventTableSort;
};

export type EventLocationOption = {
    _id: string;
    name: string;
};

export type EventCommitteeOption = {
    _id: string;
    name: string;
};

export type CreateEventForm = {
    name: string;
    description: string;
    location: string;
    newLocName: string;
    newLocAddress: string;
    start: string;
    end: string;
    image: FileList;
    committee: string;
    visibility: string;
};

export type PortalEventDetails = EventDetailsType & {
    status: EventStatus;
    rejDetails?: {
        date: string;
        reason: string;
    };
};

export type StyleProps = {
    style?: CSSProperties;
};

export type MeetingMinutes = {
    _id: string;
    date: string;
    type: string;
    otherType?: string;
    filePath: string;
};

export type MinutesForm = {
    date: string;
    type: string;
    otherType: string;
    file: FileList | null;
};

export type MinutesTableProps = {
    rows: MeetingMinutes[];
    onView: (minutes: MeetingMinutes) => void;
    onEdit: (minutes: MeetingMinutes) => void;
    onDelete: (minutes: MeetingMinutes) => void;
};

export type MinutesModalProps = {
    initialData: Partial<MeetingMinutes> | null;
    onClose: () => void;
    isOpen: boolean;
};

export type MinutesEditorProps = MinutesModalProps & {
    onSaved: () => void;
};

export type MinutesListModalProps = OpenModalProps & MinutesTableProps;

export type OpenModalProps = {
    onClose: () => void;
    isOpen: boolean;
};

export type ExecutiveRosterEntry = {
    person: string;
    id: string;
};

export type ExecutiveRoster = Record<string, ExecutiveRosterEntry>;

export type ExecutiveRosterModalProps = OpenModalProps & {
    initialData?: ExecutiveRoster;
    onSubmit: (roster: ExecutiveRoster) => void;
};

export type BlogWriterProps = OpenModalProps & {
    onSubmit: (post: {title: string; content: string; image: File | null; tags: string[]}) => void;
};

export type ModalType = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
};
