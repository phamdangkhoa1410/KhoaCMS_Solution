using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities; // Sử dụng đúng namespace entity của bạn
using System.Collections.Generic;
using System;

namespace CMS.Backend.Controllers
{
    public class PostController : Controller
    {
        public IActionResult Index()
        {
            // Tạo danh sách dữ liệu giả (Mock Data) theo yêu cầu thử thách
            var posts = new List<Post>
            {
                new Post
                {
                    Id = 1,
                    Title = "Lộ trình học ASP.NET Core cho người mới",
                    Content = "Nội dung bài viết về lộ trình học .NET Core từ cơ bản đến nâng cao...",
                    ImageUrl = "https://via.placeholder.com/300x150",
                    CreatedDate = new DateTime(2026, 4, 7)
                },
                new Post
                {
                    Id = 2,
                    Title = "ReactJS và WebAPI: Xu hướng Fullstack 2026",
                    Content = "Nội dung bài viết về sự kết hợp mạnh mẽ giữa React và ASP.NET Web API...",
                    ImageUrl = "https://via.placeholder.com/300x150",
                    CreatedDate = new DateTime(2026, 4, 6)
                },
                new Post
                {
                    Id = 3,
                    Title = "Hướng dẫn cài đặt môi trường Visual Studio",
                    Content = "Các bước cài đặt công cụ cần thiết để bắt đầu lập trình C# và .NET...",
                    ImageUrl = "https://via.placeholder.com/300x150",
                    CreatedDate = new DateTime(2026, 4, 5)
                }
            };

            return View(posts);
        }
    }
}