import LearnerProfileForm from "@/components/learner-profile-form"

export default function LearnerProfilePage() {
    return (
        <div className="py-20 px-4">

            <div className="py-4 text-center">
                <h1 className="text-3xl font-bold">Learner Profile</h1>
                <p className="text-muted-foreground">Update your learner profile information and learning preferences.</p>
            </div>
            <div className="border-b" />

            <div className="max-w-3xl mx-auto py-4">
                <LearnerProfileForm />
            </div>
        </div>
    )
}
