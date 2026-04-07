import CreatorSetting from '@/components/ui/creator/CreatorDashboard/CreatorSetting/CreatorSetting'
import { myFetch } from '../../../../../helpers/myFetch'

const page = async () => {
    const [privacyRes, termsRes, aboutRes] = await Promise.all([
        myFetch('/disclaimer?type=privacy', { method: 'GET' }),
        myFetch('/disclaimer?type=terms', { method: 'GET' }),
        myFetch('/disclaimer?type=about', { method: 'GET' }),
    ]);

    const privacy = privacyRes?.data || "";
    const terms = termsRes?.data || "";
    const about = aboutRes?.data || "";

    return (
        <div>
            <CreatorSetting
                privacy={privacy}
                terms={terms}
                about={about}
            />
        </div>
    )
}

export default page