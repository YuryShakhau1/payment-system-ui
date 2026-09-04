import React from 'react';
import {RolesSection} from "./RolesSection";
import {UserInfoSection, UserInfoSectionProps} from "./UserInfoSection";

export const UserAndRolesSection = ({
                                        isAdmin,
                                        userId,
                                        updateUserInfo
                                    }: UserInfoSectionProps) => {
    return (
        <div className="bg-white p-3 border rounded shadow-sm">
            <div className="row g-4">
                <div className="col-12 col-md-7 border-md-end pe-md-4">
                    <UserInfoSection
                        isAdmin={isAdmin}
                        userId={userId}
                        updateUserInfo={updateUserInfo}
                    />
                </div>
                <RolesSection userId={userId}/>
            </div>
        </div>
    );
};
