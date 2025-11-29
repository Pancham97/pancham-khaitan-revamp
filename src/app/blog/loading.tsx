export default function BlogLoading() {
    return (
        <div
            className={`
              min-h-screen bg-white
              dark:bg-black
            `}
        >
            <div className="max-w-4xl mx-auto px-4 py-20">
                <div className="animate-pulse">
                    {/* Breadcrumb skeleton */}
                    <div className="mb-8">
                        <div className="h-4 w-32 bg-gray-200 rounded" />
                    </div>

                    {/* Blog posts skeleton */}
                    <div className="space-y-12">
                        {[1, 2, 3].map((index) => (
                            <div
                                key={index}
                                className={`
                                  border-b-1 border-gray-200 pb-12
                                  last:border-b-0
                                `}
                            >
                                <div
                                    className={`
                                      h-8 w-3/4 bg-gray-200 rounded mb-3
                                    `}
                                />
                                <div
                                    className={`
                                      h-5 w-full bg-gray-200 rounded mb-2
                                    `}
                                />
                                <div
                                    className={`
                                      h-5 w-2/3 bg-gray-200 rounded mb-4
                                    `}
                                />
                                <div className="flex gap-4 mb-4">
                                    <div
                                        className={`
                                          h-4 w-24 bg-gray-200 rounded
                                        `}
                                    />
                                    <div
                                        className={`
                                          h-4 w-20 bg-gray-200 rounded
                                        `}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <div
                                        className={`
                                          h-6 w-16 bg-gray-200 rounded
                                        `}
                                    />
                                    <div
                                        className={`
                                          h-6 w-20 bg-gray-200 rounded
                                        `}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
